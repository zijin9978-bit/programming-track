
const START = new Date(2026, 7, 24); // Aug = 7
const END = new Date(2028, 5, 7);
const STORAGE_KEY = "programmingTrackProgressV2";
const THEME_KEY = "programmingTrackTheme";

const WEEKS = [
  ["Python：输入、输出与基本类型","完成 BMI / 成绩判断 / 简单计算器中的至少 2 个"],
  ["Python：循环与列表","完成平均分、最大值、及格人数 3 个练习"],
  ["Python：字典、集合与字符串","做一个简易学生成绩管理器"],
  ["Python：函数","把前 3 周至少 2 个程序重构成函数"],
  ["文件读写","完成 TXT 文本 / 单词统计器"],
  ["异常与调试","故意制造并修复 5 个报错，记录原因"],
  ["类与对象基础","写一个 Student 或 Task 类"],
  ["工程基础：pip / venv / Git / Terminal","把本阶段代码初始化成 Git 仓库并提交"],
  ["NumPy：array / shape / dtype / ndim","完成 10 个数组创建与 shape 练习"],
  ["NumPy：索引 / 切片 / reshape / transpose","完成 8 个形状变换练习"],
  ["NumPy：向量 / 矩阵 / 点积 / 矩阵乘法","手算 2 题，再用 NumPy 验证"],
  ["NumPy：broadcasting / 聚合 / 简单可视化","做一个小型数据分析脚本"],
  ["机器学习概念：train/val/test / feature / label","自己画出一次 ML pipeline"],
  ["线性回归","完成一个学习时间 → 成绩的回归小实验"],
  ["分类入门：Logistic Regression / Decision Tree","完成 Iris 分类实验"],
  ["PyTorch：Tensor / shape / dtype / device","把常见 NumPy 操作用 Torch 再做一遍"],
  ["PyTorch：autograd","用 3 个简单函数观察梯度"],
  ["PyTorch：nn.Module / Linear / ReLU","定义并跑通一个两层网络"],
  ["训练循环：loss / backward / optimizer","手写完整 training loop"],
  ["MNIST：数据加载","加载并可视化 MNIST 样本"],
  ["MNIST：训练与测试","训练一个基础数字识别网络"],
  ["MNIST：收尾与复盘","保存 / 加载模型，并写一页复盘"]
];

const PHASES = [
  ["2027-02-01","2027-03-31","巩固 Python + NumPy","每周 2–3 次，复写旧项目、补薄弱点"],
  ["2027-04-01","2027-06-30","机器学习 + PyTorch 巩固","以小实验为主，不追求课程速度"],
  ["2027-07-01","2027-08-31","暑假：第一个完整 AI 小项目","集中完成一个可展示的小项目"],
  ["2027-09-01","2028-06-07","高三维护模式","每周 1 次即可，只保持手感，不系统开新坑"]
];

const DAY_MODES = [
  ["学习","25–35 分钟","学习本周主题的一个小概念；看课不要连续超过 15 分钟。"],
  ["练习","25–35 分钟","不看答案，自己写 2–4 个小练习；卡住先读报错。"],
  ["手搓","25–35 分钟","围绕本周主题写一个能运行的小东西，哪怕只有 20 行。"],
  ["复盘","25–35 分钟","重写或整理本周代码，解释关键概念。"],
  ["休息","0 分钟","今天默认不安排编程，把时间让给高考主线。"],
  ["周项目","60–90 分钟","把本周知识做成一个小项目或完整练习。"],
  ["弹性","0–30 分钟","默认休息；如果本周有欠账，只补最重要的一项。"]
];

const DAILY_TASKS = [
  [
    ["25–35 分钟","安装/确认 Python 与编辑器能运行。亲手写 `print()` 和 `input()`，做 3 个输入输出小练习。"],
    ["25–35 分钟","学习 `int / float / str / bool` 与类型转换。写一个“年龄/身高/价格”输入程序。"],
    ["25–35 分钟","学习 `+ - * / // % **`。自己写一个四则运算小计算器。"],
    ["25–35 分钟","学习 `if / elif / else`。写成绩等级判断与奇偶判断。"],
    ["0 分钟","休息。今天不安排编程，把时间让给高考主线。"],
    ["60–90 分钟","周项目：完成 BMI 计算器 + 成绩等级判断器；全程自己敲代码。"],
    ["0–30 分钟","复盘：不看旧代码，重新写一次本周最难的小程序；补没完成的内容。"],
  ],
  [
    ["25–35 分钟","学习 `for` 与 `range()`；写 1~100 求和、打印偶数两个练习。"],
    ["25–35 分钟","学习 `while`；写倒计时和简单猜数字循环。"],
    ["25–35 分钟","学习 `list` 的创建、索引、修改；手动维护一个成绩列表。"],
    ["25–35 分钟","学习列表遍历与 `append/remove/len/sum/max/min`；完成 4 个小练习。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：成绩分析器——输入一组成绩，输出平均分、最高分、最低分、及格人数。"],
    ["0–30 分钟","复盘：把成绩分析器重写一次，至少自己发现并修掉 1 个 bug。"],
  ],
  [
    ["25–35 分钟","学习 `dict`：键、值、读取、修改。建立一个学生信息字典。"],
    ["25–35 分钟","学习字符串 `split/strip/replace`；做 4 个文本处理练习。"],
    ["25–35 分钟","学习 `set` 与 `tuple` 的基本用途；做去重练习。"],
    ["25–35 分钟","把 list + dict + string 组合起来，写一个简单通讯录数据结构。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：学生成绩管理器——添加、查看、修改、删除学生成绩。"],
    ["0–30 分钟","复盘：解释 list/dict/set 的区别，并整理本周代码。"],
  ],
  [
    ["25–35 分钟","学习 `def`、函数调用；把平均分计算写成函数。"],
    ["25–35 分钟","学习参数与 `return`；写 3 个有输入、有返回值的函数。"],
    ["25–35 分钟","理解局部变量与作用域；观察同名变量在函数内外的区别。"],
    ["25–35 分钟","练习“把大程序拆成小函数”：给成绩管理器设计 4~6 个函数。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：用函数重构前面的学生成绩管理器，避免重复代码。"],
    ["0–30 分钟","复盘：不看教程，独立写一个包含至少 3 个函数的小程序。"],
  ],
  [
    ["25–35 分钟","学习 `open()` 与读取文本；读取一个 txt 并打印内容。"],
    ["25–35 分钟","学习写入文件；把程序结果保存到 txt。"],
    ["25–35 分钟","学习 `with open(...)`、编码与换行；理解为什么要关闭文件。"],
    ["25–35 分钟","读取文本后做统计：字符数、行数、单词/词项数量。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：TXT 文本统计器——读取文件并输出长度、行数、出现频率最高的词项。"],
    ["0–30 分钟","复盘：给统计器增加“保存统计结果”功能。"],
  ],
  [
    ["25–35 分钟","学习 `try / except`；给输入数字的小程序加错误处理。"],
    ["25–35 分钟","学会读 traceback：制造 3 个错误，找到报错行与错误类型。"],
    ["25–35 分钟","练习常见错误：NameError、TypeError、IndexError、KeyError。"],
    ["25–35 分钟","练习调试：用 print/逐步缩小范围的方法定位一个故意写坏的程序。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","Bug 实验室：故意制造并修复至少 5 个错误，把原因写进学习记录。"],
    ["0–30 分钟","复盘：整理自己的“常见报错表”，每种写一句解释。"],
  ],
  [
    ["25–35 分钟","学习 `class` 与对象：写一个最简单的 `Student` 类。"],
    ["25–35 分钟","学习 `__init__` 与 `self`；给 Student 保存姓名和成绩。"],
    ["25–35 分钟","学习实例方法；给 Student 添加计算平均分的方法。"],
    ["25–35 分钟","理解“状态 + 行为”的类设计；尝试设计一个 `Task` 类。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：写一个 Task/Student 小系统，至少包含 1 个类、3 个方法。"],
    ["0–30 分钟","复盘：说明函数和类分别适合解决什么问题。"],
  ],
  [
    ["25–35 分钟","Terminal 基础：练习 `cd`、查看目录、创建文件夹、运行 `.py` 文件。"],
    ["25–35 分钟","学习 `pip` 与虚拟环境；创建 `.venv` 并安装一个简单第三方包。"],
    ["25–35 分钟","理解 `import`、模块；把自己的函数拆到另一个 `.py` 文件再导入。"],
    ["25–35 分钟","Git 基础：`git init/status/add/commit`，给学习目录做第一次提交。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：整理前 7 周代码为一个 Git 仓库，完成至少 2 次清晰 commit。"],
    ["0–30 分钟","复盘：确认自己能在终端独立运行 Python、创建环境、提交 Git。"],
  ],
  [
    ["25–35 分钟","安装并导入 NumPy；学习 `np.array`，创建一维/二维数组。"],
    ["25–35 分钟","学习 `shape / ndim / dtype`；观察至少 8 个不同数组。"],
    ["25–35 分钟","学习 `zeros/ones/arange/linspace`；各写 2 个例子。"],
    ["25–35 分钟","体验向量化运算：数组整体加减乘除，与 Python list 做对比。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","完成 10 个 NumPy 数组创建与 shape 练习，要求每题先预测 shape。"],
    ["0–30 分钟","复盘：看到一个数组时，先说清 ndim、shape、dtype。"],
  ],
  [
    ["25–35 分钟","NumPy 索引：一维/二维数组取单个元素与整行整列。"],
    ["25–35 分钟","NumPy 切片：练习 `:`、步长与二维切片。"],
    ["25–35 分钟","学习 `reshape`；做 6 个形状变换，并先判断元素总数是否一致。"],
    ["25–35 分钟","学习转置 `.T` 与 `transpose`；观察矩阵行列变化。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","Shape Lab：完成至少 8 个 indexing/slicing/reshape/transpose 题。"],
    ["0–30 分钟","复盘：自己设计 3 个“shape 会报错”的例子并解释原因。"],
  ],
  [
    ["25–35 分钟","复习标量、向量、矩阵；用 NumPy 表示它们。"],
    ["25–35 分钟","学习向量点积 `dot`；先手算，再让 NumPy 验证。"],
    ["25–35 分钟","学习矩阵乘法 `@`；重点判断 `(a,b) @ (b,c) -> (a,c)`。"],
    ["25–35 分钟","做 5 个只判断“能不能相乘、结果 shape 是什么”的练习。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","手算 2 组矩阵乘法，再用 NumPy 验证；写出每一步维度变化。"],
    ["0–30 分钟","复盘：解释为什么神经网络里矩阵 shape 很重要。"],
  ],
  [
    ["25–35 分钟","学习 broadcasting：标量与数组、行向量与矩阵的广播。"],
    ["25–35 分钟","学习 `sum/mean/max/min/argmax`。"],
    ["25–35 分钟","理解 `axis=0/1`；用二维成绩表分别按学生/科目统计。"],
    ["25–35 分钟","学习 `np.random` 基础，生成模拟数据。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：生成一组模拟成绩，用 NumPy 做平均、排名、分布统计，并画 1 张图。"],
    ["0–30 分钟","复盘：独立解释 broadcasting 和 axis。"],
  ],
  [
    ["25–35 分钟","理解 feature、label、sample、model、prediction 五个概念。"],
    ["25–35 分钟","理解 train / validation / test 的职责，不写复杂代码。"],
    ["25–35 分钟","用 scikit-learn 跑通一个最小模型：数据 → fit → predict。"],
    ["25–35 分钟","理解 overfitting / underfitting，用生活例子和模型例子各解释一次。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","画出并亲手实现一次最小 ML pipeline：准备数据→切分→训练→预测→评估。"],
    ["0–30 分钟","复盘：不用术语堆砌，自己口述一次机器学习完整流程。"],
  ],
  [
    ["25–35 分钟","理解线性回归在做什么：用直线拟合输入与输出关系。"],
    ["25–35 分钟","用 sklearn `LinearRegression` 跑最小例子。"],
    ["25–35 分钟","观察 `coef_`、`intercept_` 与预测值，理解它们含义。"],
    ["25–35 分钟","认识 MAE/MSE/R²，只要求知道它们在衡量什么。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：自己造一份“学习时间→成绩”小数据，训练、预测并画散点+拟合线。"],
    ["0–30 分钟","复盘：改变数据中的异常点，观察回归结果怎么变。"],
  ],
  [
    ["25–35 分钟","理解分类任务，与回归做对比；跑通 Logistic Regression。"],
    ["25–35 分钟","学习 Decision Tree 的直观思想并跑一个最小例子。"],
    ["25–35 分钟","学习 train_test_split，把 Iris 数据切成训练/测试集。"],
    ["25–35 分钟","理解 accuracy 和 confusion matrix 的用途。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：Iris 分类，对比 Logistic Regression 与 Decision Tree 的测试结果。"],
    ["0–30 分钟","复盘：写下两个模型各自最直观的工作方式。"],
  ],
  [
    ["25–35 分钟","安装/导入 PyTorch；创建 Tensor，查看 shape 与 dtype。"],
    ["25–35 分钟","Tensor 索引、reshape、基本运算；把 NumPy 的常用操作重做一遍。"],
    ["25–35 分钟","学习 Tensor 与 NumPy 互转。"],
    ["25–35 分钟","理解 `device`，知道 CPU/GPU Tensor 的概念；有 GPU 再尝试移动设备。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：做一份 NumPy ↔ PyTorch 对照练习，至少 10 个操作。"],
    ["0–30 分钟","复盘：解释 Tensor 和 NumPy array 的相似与不同。"],
  ],
  [
    ["25–35 分钟","学习 `requires_grad=True`，观察 `x**2` 的梯度。"],
    ["25–35 分钟","练习 `y=3x+2`、`y=x**3` 的自动求导。"],
    ["25–35 分钟","理解计算图与链式法则的直觉，不要求完整推导。"],
    ["25–35 分钟","观察多个变量的梯度；理解 `.backward()` 在做什么。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","梯度实验：选 3 个简单函数，先手算导数，再用 autograd 验证。"],
    ["0–30 分钟","复盘：用自己的话解释“为什么训练神经网络需要梯度”。"],
  ],
  [
    ["25–35 分钟","学习 `nn.Module` 的基本结构，先读懂一个最小模型。"],
    ["25–35 分钟","学习 `nn.Linear`：输入维度、输出维度、权重 shape。"],
    ["25–35 分钟","学习 ReLU，并观察正负输入经过 ReLU 后的变化。"],
    ["25–35 分钟","自己写 `forward()`，让一批随机数据成功通过网络。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：定义一个两层 MLP，打印每一层输入输出 shape，确保前向传播跑通。"],
    ["0–30 分钟","复盘：画出 Input → Linear → ReLU → Linear → Output。"],
  ],
  [
    ["25–35 分钟","理解 loss：模型预测为什么需要一个可优化的误差指标。"],
    ["25–35 分钟","学习 optimizer，先认识 SGD/Adam 的作用。"],
    ["25–35 分钟","把 `zero_grad → forward → loss → backward → step` 跑通一次。"],
    ["25–35 分钟","手写一个小 training loop，打印每轮 loss。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：训练一个极小回归/分类网络，让 loss 明显下降。"],
    ["0–30 分钟","复盘：不看旧代码，写出训练循环的 5 个核心步骤。"],
  ],
  [
    ["25–35 分钟","认识 MNIST 数据集；用 torchvision 下载并读取。"],
    ["25–35 分钟","学习 Dataset / DataLoader 的用途；取出一个 batch。"],
    ["25–35 分钟","检查 batch 的 image/label shape，理解 batch dimension。"],
    ["25–35 分钟","可视化若干手写数字与标签，确认数据管线正确。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：完成 MNIST 数据加载脚本，能遍历 batch 并展示样本。"],
    ["0–30 分钟","复盘：解释 Dataset、DataLoader、batch 各自解决什么问题。"],
  ],
  [
    ["25–35 分钟","为 MNIST 定义一个简单 MLP，并检查输出维度为 10。"],
    ["25–35 分钟","定义交叉熵 loss 与 optimizer，跑通第一个 batch 的训练。"],
    ["25–35 分钟","写完整 epoch 训练循环，记录 loss。"],
    ["25–35 分钟","学习 `model.eval()` 与 `torch.no_grad()`，计算测试准确率。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","周项目：完整训练 MNIST 模型并得到可用测试准确率；记录训练时间与结果。"],
    ["0–30 分钟","复盘：检查训练/测试代码，确认没有把测试集用于训练。"],
  ],
  [
    ["25–35 分钟","学习 `state_dict`，保存训练好的模型。"],
    ["25–35 分钟","新建模型实例并加载权重，确认预测结果一致。"],
    ["25–35 分钟","查看模型预测错误的若干样本，尝试分析为什么错。"],
    ["25–35 分钟","整理项目结构与 README：环境、运行方式、模型结构、结果。"],
    ["0 分钟","休息。"],
    ["60–90 分钟","期末项目收尾：从加载数据到训练、评估、保存、加载完整跑一遍。"],
    ["0–30 分钟","总复盘：写一页总结——这学期会了什么、最薄弱什么、寒假下一步是什么。"],
  ],
];

let currentStatus = "未开始";
let currentMastery = 3;
let deferredPrompt = null;

function pad(n){ return String(n).padStart(2,"0"); }
function keyOf(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function parseLocal(s){
  const [y,m,d] = s.split("-").map(Number);
  return new Date(y,m-1,d);
}
function dayDiff(a,b){
  const aa = new Date(a.getFullYear(),a.getMonth(),a.getDate());
  const bb = new Date(b.getFullYear(),b.getMonth(),b.getDate());
  return Math.floor((aa-bb)/86400000);
}
function loadProgress(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
function saveProgress(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function taskFor(d){
  if(d < START) return {title:"尚未开学",duration:"0 分钟",task:"计划从 2026-08-24 开始。现在不用提前赶进度。",output:"保持高考主线即可"};
  if(d > END) return {title:"计划已结束",duration:"—",task:"高中阶段计划已经结束。",output:"进入大学阶段 AI 学习路线"};

  const wi = Math.floor(dayDiff(d, START)/7);
  if(wi >= 0 && wi < WEEKS.length){
    const [topic, output] = WEEKS[wi];
    const dayIndex = d.getDay() === 0 ? 6 : d.getDay()-1;
    const [duration, instruction] = DAILY_TASKS[wi][dayIndex];
    return {title:`第 ${wi+1} 周 · ${topic}`, duration, task:instruction, output};
  }

  for(const [s,e,title,desc] of PHASES){
    const sd=parseLocal(s), ed=parseLocal(e);
    if(d>=sd && d<=ed){
      if(title==="高三维护模式"){
        const isSat = d.getDay()===6;
        return {
          title,
          duration:isSat?"30–45 分钟":"0 分钟",
          task:isSat?"维护：回看一个旧项目/旧笔记，亲手写 30–45 分钟代码，不开新知识线。":"今天不安排编程。",
          output:desc
        };
      }
      const [mode,duration,instruction] = DAY_MODES[d.getDay() === 0 ? 6 : d.getDay()-1];
      return {title,duration,task:d.getDay()===5?"今天不安排编程。":`${mode}：${instruction}`,output:desc};
    }
  }
  return {title:"弹性阶段",duration:"0–30 分钟",task:"复习旧内容或休息，不强行开新知识。",output:"以高考为主"};
}

function formatDate(d){
  const names=["日","一","二","三","四","五","六"];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 · 周${names[d.getDay()]}`;
}

function currentStreak(progress){
  let d = new Date();
  d = new Date(d.getFullYear(),d.getMonth(),d.getDate());
  let streak=0;
  while(d>=START){
    if(progress[keyOf(d)]?.status==="完成"){streak++; d.setDate(d.getDate()-1);}
    else break;
  }
  return streak;
}

function weekRecords(progress){
  const now=new Date();
  const monday=new Date(now);
  const day=(now.getDay()+6)%7;
  monday.setDate(now.getDate()-day);
  monday.setHours(0,0,0,0);
  let c=0;
  for(let i=0;i<7;i++){
    const d=new Date(monday); d.setDate(monday.getDate()+i);
    if(progress[keyOf(d)]?.status && progress[keyOf(d)].status!=="未开始") c++;
  }
  return c;
}

function renderToday(){
  const d=new Date();
  d.setHours(0,0,0,0);
  const task=taskFor(d);
  const progress=loadProgress();
  const rec=progress[keyOf(d)] || {};

  document.getElementById("todayDate").textContent=formatDate(d);
  document.getElementById("taskTitle").textContent=task.title;
  document.getElementById("taskSummary").textContent=task.output;
  document.getElementById("durationPill").textContent=task.duration;
  document.getElementById("taskDetail").textContent=task.task;
  document.getElementById("weeklyOutput").textContent=task.output;

  const done=Object.values(progress).filter(x=>x.status==="完成").length;
  document.getElementById("statDone").textContent=done;
  document.getElementById("statStreak").textContent=currentStreak(progress);
  document.getElementById("statWeek").textContent=weekRecords(progress);

  currentStatus=rec.status || "未开始";
  currentMastery=rec.mastery || 3;
  document.getElementById("minutesInput").value=rec.minutes || 0;
  document.getElementById("notesInput").value=rec.notes || "";
  document.getElementById("artifactInput").value=rec.artifact || "";
  syncControls();
}

function syncControls(){
  document.querySelectorAll("#statusControl button").forEach(b=>b.classList.toggle("active",b.dataset.status===currentStatus));
  document.querySelectorAll("#masteryControl button").forEach(b=>b.classList.toggle("active",Number(b.dataset.mastery)===Number(currentMastery)));
}

function saveToday(){
  const d=new Date(); d.setHours(0,0,0,0);
  const progress=loadProgress();
  progress[keyOf(d)]={
    status:currentStatus,
    minutes:Number(document.getElementById("minutesInput").value||0),
    mastery:Number(currentMastery),
    notes:document.getElementById("notesInput").value.trim(),
    artifact:document.getElementById("artifactInput").value.trim(),
    updatedAt:new Date().toISOString()
  };
  saveProgress(progress);
  const toast=document.getElementById("savedToast");
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1200);
  renderToday();
  renderCalendar();
}

function monthCard(year,month,progress){
  const card=document.createElement("div");
  card.className="month-card";
  const title=document.createElement("div");
  title.className="month-title";
  title.textContent=`${year}.${pad(month+1)}`;
  card.appendChild(title);

  const wd=document.createElement("div");
  wd.className="weekdays";
  ["一","二","三","四","五","六","日"].forEach(x=>{
    const el=document.createElement("div"); el.textContent=x; wd.appendChild(el);
  });
  card.appendChild(wd);

  const days=document.createElement("div"); days.className="days";
  const first=new Date(year,month,1);
  const last=new Date(year,month+1,0).getDate();
  const offset=(first.getDay()+6)%7;
  for(let i=0;i<offset;i++){
    const el=document.createElement("div"); el.className="day off"; days.appendChild(el);
  }
  const today=new Date(); today.setHours(0,0,0,0);
  for(let n=1;n<=last;n++){
    const d=new Date(year,month,n);
    const el=document.createElement("div");
    el.className="day";
    el.textContent=n;
    if(d<START || d>END) el.classList.add("off");
    else{
      const st=progress[keyOf(d)]?.status;
      if(st==="完成") el.classList.add("done");
      else if(st==="部分完成") el.classList.add("partial");
      else if(d<today) el.classList.add("missed");
      else el.classList.add("future");
    }
    if(keyOf(d)===keyOf(today)) el.classList.add("today");
    days.appendChild(el);
  }
  card.appendChild(days);
  return card;
}

function renderCalendar(){
  const grid=document.getElementById("calendarGrid");
  grid.innerHTML="";
  const progress=loadProgress();
  let y=START.getFullYear(), m=START.getMonth();
  while(y<END.getFullYear() || (y===END.getFullYear() && m<=END.getMonth())){
    grid.appendChild(monthCard(y,m,progress));
    m++;
    if(m===12){m=0;y++;}
  }
}

function renderPlan(){
  const list=document.getElementById("planList");
  list.innerHTML="";
  WEEKS.forEach(([topic,out],i)=>{
    const s=new Date(START); s.setDate(START.getDate()+i*7);
    const e=new Date(s); e.setDate(s.getDate()+6);
    const item=document.createElement("div");
    item.className="plan-item";
    const satTask = DAILY_TASKS[i][5][1];
    item.innerHTML=`<div class="plan-meta">第 ${i+1} 周 · ${pad(s.getMonth()+1)}/${pad(s.getDate())}–${pad(e.getMonth()+1)}/${pad(e.getDate())}</div><div class="plan-title">${topic}</div><div class="plan-output">${out}<br><br><b>周六：</b>${satTask}</div>`;
    list.appendChild(item);
  });

  const phases=document.getElementById("phaseList");
  phases.innerHTML="";
  PHASES.forEach(([s,e,title,desc])=>{
    const item=document.createElement("div");
    item.className="plan-item";
    item.innerHTML=`<div class="plan-meta">${s} → ${e}</div><div class="plan-title">${title}</div><div class="plan-output">${desc}</div>`;
    phases.appendChild(item);
  });
}

function switchPage(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.dataset.page===name));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.target===name));
  const titles={today:"今日",calendar:"日历",plan:"计划",data:"数据"};
  document.getElementById("pageTitle").textContent=titles[name];
  window.scrollTo({top:0,behavior:"smooth"});
}

function exportData(){
  const payload={version:2,exportedAt:new Date().toISOString(),progress:loadProgress()};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`programming-track-${keyOf(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importData(file){
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      const progress=data.progress || data;
      if(typeof progress!=="object") throw new Error();
      saveProgress(progress);
      renderToday(); renderCalendar();
      alert("导入成功");
    }catch{ alert("文件格式不正确"); }
  };
  reader.readAsText(file);
}

document.querySelectorAll("#statusControl button").forEach(b=>b.addEventListener("click",()=>{currentStatus=b.dataset.status;syncControls();}));
document.querySelectorAll("#masteryControl button").forEach(b=>b.addEventListener("click",()=>{currentMastery=Number(b.dataset.mastery);syncControls();}));
document.getElementById("saveBtn").addEventListener("click",saveToday);
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>switchPage(b.dataset.target)));
document.getElementById("exportBtn").addEventListener("click",exportData);
document.getElementById("importInput").addEventListener("change",e=>{if(e.target.files[0]) importData(e.target.files[0]);});
document.getElementById("resetBtn").addEventListener("click",()=>{
  if(confirm("确定清空本机全部学习记录？")){
    localStorage.removeItem(STORAGE_KEY);
    renderToday(); renderCalendar();
  }
});

const root=document.documentElement;
const savedTheme=localStorage.getItem(THEME_KEY);
if(savedTheme==="light") root.classList.add("light");
document.getElementById("themeBtn").addEventListener("click",()=>{
  root.classList.toggle("light");
  localStorage.setItem(THEME_KEY,root.classList.contains("light")?"light":"dark");
});

window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault();
  deferredPrompt=e;
  document.getElementById("installBtn").disabled=false;
});
document.getElementById("installBtn").addEventListener("click",async()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
  document.getElementById("installBtn").disabled=true;
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}

renderToday();
renderCalendar();
renderPlan();
