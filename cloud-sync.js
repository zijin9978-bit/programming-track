(() => {
  "use strict";

  const CONFIG_KEY = "programmingTrackCloudConfigV1";
  const SESSION_KEY = "programmingTrackCloudSessionV1";
  const LAST_SYNC_KEY = "programmingTrackLastSyncV1";
  let syncTimer = null;
  let syncing = false;

  const el = id => document.getElementById(id);

  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); }
    catch { return null; }
  }

  function cleanUrl(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function config() {
    const value = readJson(CONFIG_KEY);
    return value?.url && value?.key ? value : null;
  }

  function session() { return readJson(SESSION_KEY); }

  function setStatus(label, type = "") {
    const badge = el("syncBadge");
    badge.textContent = label;
    badge.className = `sync-badge ${type}`.trim();
  }

  function setMessage(message) { el("syncMessage").textContent = message; }

  function errorText(error) {
    if (!navigator.onLine) return "当前离线。记录已保存在本机，联网后会继续同步。";
    return error?.message || "同步失败，请稍后再试。";
  }

  async function request(path, options = {}, useSession = false) {
    const cfg = config();
    if (!cfg) throw new Error("请先填写并保存 Supabase 配置。 ");
    const headers = { "Content-Type": "application/json", apikey: cfg.key, ...(options.headers || {}) };
    if (useSession) {
      const active = await validSession();
      if (!active?.access_token) throw new Error("登录已失效，请重新登录。 ");
      headers.Authorization = `Bearer ${active.access_token}`;
    }
    const response = await fetch(`${cfg.url}${path}`, { ...options, headers });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!response.ok) {
      const message = data?.msg || data?.message || data?.error_description || data?.error || `请求失败 (${response.status})`;
      throw new Error(message);
    }
    return data;
  }

  async function refreshSession(active) {
    if (!active?.refresh_token) return null;
    const cfg = config();
    const response = await fetch(`${cfg.url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: cfg.key },
      body: JSON.stringify({ refresh_token: active.refresh_token })
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.access_token) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    saveSession(data);
    return data;
  }

  async function validSession() {
    const active = session();
    if (!active) return null;
    const expiresAt = Number(active.expires_at || 0);
    if (expiresAt > Math.floor(Date.now() / 1000) + 60) return active;
    return refreshSession(active);
  }

  function saveSession(data) {
    const expiresAt = data.expires_at || Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...data, expires_at: expiresAt }));
  }

  function newer(a, b) {
    const at = Date.parse(a?.updatedAt || a?.updated_at || 0) || 0;
    const bt = Date.parse(b?.updatedAt || b?.updated_at || 0) || 0;
    return at >= bt ? a : b;
  }

  function remoteToLocal(row) {
    return {
      status: row.status,
      minutes: row.minutes,
      mastery: row.mastery,
      notes: row.notes || "",
      artifact: row.artifact || "",
      updatedAt: row.updated_at
    };
  }

  function localToRemote(date, record, userId) {
    return {
      user_id: userId,
      record_date: date,
      status: record.status || "未开始",
      minutes: Number(record.minutes || 0),
      mastery: Number(record.mastery || 3),
      notes: record.notes || "",
      artifact: record.artifact || "",
      updated_at: record.updatedAt || new Date().toISOString()
    };
  }

  async function syncNow({ quiet = false } = {}) {
    if (syncing || !config() || !session()) return;
    if (!navigator.onLine) {
      setStatus("等待联网", "syncing");
      setMessage("记录已保存在本机；恢复网络后会自动同步。 ");
      return;
    }
    syncing = true;
    setStatus("同步中", "syncing");
    try {
      const active = await validSession();
      if (!active?.user?.id) throw new Error("登录已失效，请重新登录。 ");
      const rows = await request("/rest/v1/study_records?select=record_date,status,minutes,mastery,notes,artifact,updated_at", { method: "GET" }, true);
      const merged = { ...window.ProgrammingTrackStore.load() };
      for (const row of rows || []) {
        const local = merged[row.record_date];
        merged[row.record_date] = local ? newer(local, remoteToLocal(row)) : remoteToLocal(row);
      }
      const payload = Object.entries(merged).map(([date, record]) => localToRemote(date, record, active.user.id));
      if (payload.length) {
        await request("/rest/v1/study_records?on_conflict=user_id,record_date", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(payload)
        }, true);
      }
      window.ProgrammingTrackStore.save(merged);
      window.ProgrammingTrackStore.refresh();
      const stamp = new Date().toISOString();
      localStorage.setItem(LAST_SYNC_KEY, stamp);
      renderState();
      setStatus("已同步", "online");
      setMessage("本机与云端记录已合并。之后每次保存都会自动同步。 ");
    } catch (error) {
      setStatus("同步失败", "error");
      setMessage(errorText(error));
      if (!quiet) console.error(error);
    } finally {
      syncing = false;
    }
  }

  function scheduleSync() {
    if (!config() || !session()) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncNow({ quiet: true }), 700);
  }

  async function signIn() {
    const email = el("cloudEmailInput").value.trim();
    const password = el("cloudPasswordInput").value;
    if (!email || !password) return setMessage("请输入邮箱和密码。 ");
    setStatus("登录中", "syncing");
    try {
      const data = await request("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
      saveSession(data);
      el("cloudPasswordInput").value = "";
      renderState();
      await syncNow();
    } catch (error) {
      setStatus("登录失败", "error");
      setMessage(errorText(error));
    }
  }

  async function signUp() {
    const email = el("cloudEmailInput").value.trim();
    const password = el("cloudPasswordInput").value;
    if (!email || password.length < 6) return setMessage("请输入有效邮箱，密码至少 6 位。 ");
    setStatus("注册中", "syncing");
    try {
      const data = await request("/auth/v1/signup", { method: "POST", body: JSON.stringify({ email, password }) });
      if (data?.access_token) {
        saveSession(data);
        renderState();
        await syncNow();
      } else {
        setStatus("等待验证", "syncing");
        setMessage("注册成功。请到邮箱完成验证，然后回来登录。 ");
      }
    } catch (error) {
      setStatus("注册失败", "error");
      setMessage(errorText(error));
    }
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    renderState();
    setMessage("已退出云端账号。本机记录仍然保留。 ");
  }

  function saveConfig() {
    const url = cleanUrl(el("cloudUrlInput").value);
    const key = el("cloudKeyInput").value.trim();
    if (!/^https:\/\/.+\.supabase\.co$/i.test(url) || !key) {
      setStatus("配置有误", "error");
      return setMessage("请检查 Supabase 项目网址和客户端密钥。 ");
    }
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ url, key }));
    localStorage.removeItem(SESSION_KEY);
    el("cloudKeyInput").value = "";
    el("cloudSetup").open = false;
    renderState();
    setMessage("云端配置已保存。现在可注册或登录。 ");
  }

  function renderState() {
    const cfg = config();
    const active = session();
    el("authPanel").hidden = !cfg || Boolean(active);
    el("syncPanel").hidden = !active;
    if (cfg) el("cloudUrlInput").value = cfg.url;
    if (active) {
      el("cloudAccount").textContent = active.user?.email || "已登录账号";
      const stamp = localStorage.getItem(LAST_SYNC_KEY);
      el("lastSyncText").textContent = stamp ? `上次同步：${new Date(stamp).toLocaleString("zh-CN")}` : "尚未完成首次同步";
      setStatus(navigator.onLine ? "已登录" : "离线", navigator.onLine ? "online" : "syncing");
    } else {
      setStatus(cfg ? "未登录" : "仅本机");
    }
  }

  el("saveCloudConfigBtn").addEventListener("click", saveConfig);
  el("signInBtn").addEventListener("click", signIn);
  el("signUpBtn").addEventListener("click", signUp);
  el("signOutBtn").addEventListener("click", signOut);
  el("syncNowBtn").addEventListener("click", () => syncNow());
  window.addEventListener("online", () => { renderState(); scheduleSync(); });
  window.addEventListener("offline", renderState);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) scheduleSync(); });

  window.CloudSync = { syncNow, scheduleSync };
  renderState();
  scheduleSync();
})();
