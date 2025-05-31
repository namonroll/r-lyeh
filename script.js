const inputBox = document.getElementById('inputBox');
const windowEl = document.getElementById('simWindow');
let ctrlPressed = false;
let currentTab = "main"; // 預設在主頁面
let hintMode = false; 
let focusedInput = null;

function backspace() {
  inputBox.value = inputBox.value.slice(0, -1);
}

function closeWindow() {
  windowEl.style.display = 'none';
}

function minimizeWindow() {
  windowEl.style.display = (windowEl.style.display === 'none') ? 'block' : 'none';
}

function toggleFullscreen() {
  windowEl.classList.toggle('fullscreen');
}
let startTime = null;

document.getElementById('start-btn').addEventListener('click', () => {
  showGameScreen();
});

function showGameScreen() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  document.addEventListener("click", function (e) {
  const addressInput = document.getElementById("address-input");

  // 如果目前是聚焦地址輸入欄，且點擊目標不是輸入框本身
  if (
    focusedInput === addressInput &&
    e.target !== addressInput &&
    !addressInput.contains(e.target)
  ) {
    addressInput.blur();       // 取消輸入焦點
    focusedInput = null;       // 清除虛擬鍵盤輸入目標
  }
});

  startTime = Date.now(); // ⏱️ 開始計時
  console.log("計時開始");
}

//DevTools那邊
let commentRemoved = false;

function pressKey(key) {
  if (key === 'F12') {
    const devtools = document.getElementById("devtools");
    const elementContent = document.getElementById("element-content");
    const consoleContent = document.getElementById("console-content");

    devtools.classList.remove("hidden");

    // 根據目前的分頁內容來變更 DevTools 顯示的 HTML 模擬
    if (currentTab === "main") {
      elementContent.innerHTML = `
  &lt;!DOCTYPE html&gt;
  &lt;html lang="zh-Hant"&gt;
  &lt;head&gt;
    &lt;title&gt;Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl F12htagn&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;p&gt;mini web&lt;/p&gt;
    <button onclick="removeComment()" class="comment-delete">✕</button>
    &lt;<span id="open-comment">&excl;--</span>
    &lt;img src="隱藏圖片.jpg"&gt;
    <span id="close-comment">--&gt;</span>
  &lt;/body&gt;
  &lt;/html&gt;
      `;
    } else if (currentTab === "history") {
      elementContent.innerHTML = `
  &lt;html&gt;
  &lt;body&gt;
    &lt;!-- 歷史紀錄頁面無特殊資訊 --&gt;
  &lt;/body&gt;
  &lt;/html&gt;
      `;
    } else {
      elementContent.innerHTML = `
  &lt;html&gt;
  &lt;body&gt;
    &lt;!-- 預設內容 --&gt;
  &lt;/body&gt;
  &lt;/html&gt;
      `;
    }

    // 預設顯示 element tab
    elementContent.classList.remove("hidden");
    consoleContent.classList.add("hidden");

    return;
}
   // 處理 Backspace 鍵
  if (key === 'Backspace') {
    if (focusedInput) {
      focusedInput.value = focusedInput.value.slice(0, -1);
    }
    return;
  }
  // 虛擬鍵盤輸入至目前輸入框
  if (focusedInput) {
    focusedInput.value += key;
    return;
  }
  
  if (key === 'Ctrl') {
    ctrlPressed = true;

    // 高亮 Ctrl 鍵（選配）
    highlightCtrl();
    return;
  }

  // 處理 Ctrl 組合鍵
  if (ctrlPressed) {
    handleCtrlCombo(key);
    ctrlPressed = false;
    removeHighlightCtrl(); // 清除高亮
    return;
  }
    // 🆕 新增：如果搜尋欄是可見的，就輸入到搜尋欄
  const searchBar = document.getElementById("search-bar");
  const inputBox = document.getElementById("search-input");
  if (!searchBar.classList.contains("hidden")) {
    // append 輸入文字
    inputBox.value += key;
    return;
  }

  if (key === 'Enter') {
  if (focusedInput?.id === 'search-input') {
    submitSearch();
  } else if (focusedInput?.id === 'address-input') {
    handleAddressEnter();
  }
  return;
}

  // 處理單一鍵
  console.log(`單鍵輸入: ${key}`);
}

// DevTools UI 切換邏輯
document.getElementById("close-devtools").addEventListener("click", () => {
  document.getElementById("devtools").classList.add("hidden");
});

document.getElementById("tab-element").addEventListener("click", () => {
  document.getElementById("element-content").classList.remove("hidden");
  document.getElementById("element-content").classList.add("visible");
  document.getElementById("console-content").classList.add("hidden");
});

document.getElementById("tab-console").addEventListener("click", () => {
  document.getElementById("console-content").classList.remove("hidden");
  document.getElementById("console-content").classList.add("visible");
  document.getElementById("element-content").classList.add("hidden");
});
function removeComment() {
  const open = document.getElementById("open-comment");
  const close = document.getElementById("close-comment");

  if (open) open.remove();
  if (close) close.remove();

  // 顯示提示訊息
  const webpage = document.querySelector(".webpage-content");
  if (!document.getElementById("hint-msg")) {
    const msg = document.createElement("div");
    msg.id = "hint-msg";
    msg.className = "hint-text";
    msg.textContent = "we have met 3000 years ago";
    webpage.appendChild(msg);
  }
}
function handleCtrlCombo(key) {
  if (key === 'H') {
    console.log('Ctrl + H 被觸發！');
    openHistoryWindow(); // 這是你要建立的分頁函式
  } else if (key === 'F') {
    console.log('Ctrl + F 被觸發！顯示搜尋欄');
    showSearchBar();
  }else if (key === 'A') {
    console.log('Ctrl + A 被觸發！全選文字');
    handleSelectAll();
  }
}
//全選ctrl+A
function handleSelectAll() {
  if (focusedInput) {
    // 如果有輸入框被選到，優先選取該欄位
    focusedInput.focus();
    focusedInput.setSelectionRange(0, focusedInput.value.length);
  } else {
    // 否則選取整個模擬網頁內容
    const content = document.getElementById("webpage-content");
    const range = document.createRange();
    range.selectNodeContents(content);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function highlightCtrl() {
  const ctrlKey = document.querySelector('.key[onclick*="Ctrl"]');
  if (ctrlKey) ctrlKey.classList.add('ctrl-active');
}

function removeHighlightCtrl() {
  const ctrlKey = document.querySelector('.key[onclick*="Ctrl"]');
  if (ctrlKey) ctrlKey.classList.remove('ctrl-active');
}
function openHistoryWindow() {
  // 防止重複新增
  if (document.querySelector('.tab[data-tab="history"]')) return;

  // ➤ 新增歷史分頁 tab
  const tabBar = document.getElementById("tab-bar");
  const newTab = document.createElement("div");
  newTab.className = "tab";
  newTab.dataset.tab = "history";
  newTab.innerHTML = `
    <img src="https://www.google.com/s2/favicons?sz=16&domain=history.com" class="favicon">
    <span>Search History</span>
    <span class="close-tab" onclick="handleTabClose('history')">✕</span>
  `;
  newTab.addEventListener("click", () => switchTab("history"));
  tabBar.appendChild(newTab);

  // ➤ 新增歷史內容區塊
  const content = document.getElementById("webpage-content");
  content.innerHTML = `
    <ul class="history-list">
      <li>1. 3sec ago , find.me.in.anger.com</li>
      <li>2. 3days ago , Im.here.in.anger.com</li>
      <li>3. 2025/3/3 , go.to.virtualand.in.anger.com</li>
      <li>4. 2003/3/3 , sorry.in.anger.com</li>
      <li>5. 1630/3/3 , when.we.all.gone.in.anger.com</li>
      <li>6. 975 B.C , look.back.in.anger.com</li>
      <li>7. The first time I saw you, why.dont.you.go.in.anger.com</li>
      <li>8. h#%^5gjl%e , $^WZresy6i.com</li>
    </ul>
  `;

  // 切換分頁高亮
  setActiveTab("history");
  switchTab("history");
}
function switchTab(tabName) {
  currentTab = tabName; // ← 在這裡記住目前分頁

  setActiveTab(tabName);
  const content = document.getElementById("webpage-content");

  if (tabName === "main") {
    content.innerHTML = `<p>Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl <span class="ftwelve">F12</span>htagn</p>`;
    const hint = document.getElementById("hint-msg");
    if (hint) content.appendChild(hint);
  }

  if (tabName === "history") {
    content.innerHTML = `
      <ul class="history-list">
        <li onclick="handleHistoryClick(1)">1. 3sec ago , find.me.in.anger.com</li>
        <li onclick="handleHistoryClick(2)">2. 3days ago , Im.here.in.anger.com</li>
        <li onclick="handleHistoryClick(3)">3. 2025/3/3 , go.to.virtualand.in.anger.com</li>
        <li onclick="handleHistoryClick(4)">4. 2003/3/3 , sorry.in.anger.com</li>
        <li onclick="handleHistoryClick(5)">5. 1630/3/3 , when.we.all.gone.in.anger.com</li>
        <li onclick="handleHistoryClick(6)">6. 975 B.C , look.back.in.anger.com</li>
        <li onclick="handleHistoryClick(7)">7. The first time I saw you, why.dont.you.go.in.anger.com</li>
        <li onclick="handleHistoryClick(8)">8. h#%^5gjl%e , $^WZresy6i.com</li>
      </ul>
    `;
  }
  if (tabName === "peace") {
  content.innerHTML = `

    <p>where you can be a higher level collection of consciousness if you can see what's undercovered and<span class="ftwelve"> select all</span> you want</p>
    <br><br><h5 style="color: #2d2d2d;">moomee.com</h5>
  `;
}
  if (tabName === "rlyeh") {
  content.innerHTML = `
    <div class="rlyeh-page">
      <p style="font-style: italic; color: darkgreen;">
        <p>Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn</p><br>
        <p>In his house at R'lyeh, dead Cthulhu waits dreaming</p>
      </p>
      <button class="btn" onclick="handleFinalEntrance()">entrance to R'LYEH</button>
    </div>
  `;
}
}

function handleTabClose(tabName) {
  if (tabName === "main") {
    alert("you can't go");
    return;
  }

  // 移除 tab
  const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
  if (tab) tab.remove();

  // 切回主頁
  switchTab("main");
}
// 切換分頁高亮
function setActiveTab(tabName) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
    if (tab.dataset.tab === tabName) {
      tab.classList.add("active");
    }
  });
}
function handleHistoryClick(index) {
  if (index === 6) {
    console.log("正確紀錄，前往提示頁");
    hintMode = true;
    currentTab = "hint";
    showTrueHintWindow(); // 這是你之後要實作的真正提示頁
  } else {
    console.log("錯誤紀錄，顯示錯誤圖片");
    hintMode = false;
    showWrongHintWindow();
  }
}
function showWrongHintWindow() {
  document.getElementById("wrong-hint-window").classList.remove("hidden");
}

function closeWrongHint() {
  document.getElementById("wrong-hint-window").classList.add("hidden");
}

function showTrueHintWindow() {
  document.getElementById("true-hint-window").classList.remove("hidden");
}

function closeTrueHint() {
  document.getElementById("true-hint-window").classList.add("hidden");
}
function showSearchBar() {
  const bar = document.getElementById("search-bar");
  const input = document.getElementById("search-input");
  bar.classList.remove("hidden");
  focusedInput = input; // ✅ 將虛擬鍵盤焦點設為搜尋欄
}

function submitSearch() {
  const keyword = document.getElementById("search-input").value.trim();
  console.log("查詢內容:", keyword);

    if (hintMode && (keyword === "i" || keyword === "I")) {
    hideSearchBar();
    showFinalHintWindow(); // ✅ 顯示最終提示圖（圖片 C）
  } else {
    alert("查無結果");
  }
}
function hideSearchBar() {
  document.getElementById("search-bar").classList.add("hidden");
  focusedInput = null;
}
function showFinalHintWindow() {
  document.getElementById("final-hint-window").classList.remove("hidden");
}
function closeFinalHint() {
  document.getElementById("final-hint-window").classList.add("hidden");
}
function handleVirtualBackspace() {
  const searchBar = document.getElementById("search-bar");
  const inputBox = document.getElementById("search-input");

  if (!searchBar.classList.contains("hidden")) {
    inputBox.value = inputBox.value.slice(0, -1);
  }
}
function handleAddressEnter() {
  const addressInput = document.getElementById("address-input");
  const enteredURL = addressInput.value.trim();

  if (enteredURL === "look.back.in.peace.com" || enteredURL === "LOOK.BACK.IN.PEACE.COM") {
    openPeacePage(); // ✅ 成功跳轉
  }else if (enteredURL === "moomee.com" || enteredURL === "MOOMEE.COM") {
    openRlyehPage(); // 🔥 進入終極
  } else {
    alert("❌ 找不到該網站");
  }
}
function openPeacePage() {
  // 避免重複新增
  if (document.querySelector('.tab[data-tab="peace"]')) return;

  const tabBar = document.getElementById("tab-bar");

  const newTab = document.createElement("div");
  newTab.className = "tab";
  newTab.dataset.tab = "peace";
  newTab.innerHTML = `
    <img src="https://www.google.com/s2/favicons?sz=16&domain=peace.com" class="favicon">
    <span>peace</span>
    <span class="close-tab" onclick="handleTabClose('peace'); event.stopPropagation();">✕</span>
  `;
  newTab.addEventListener("click", () => switchTab("peace"));
  tabBar.appendChild(newTab);

  // 切換到該分頁
  switchTab("peace");
}function openRlyehPage() {
  if (document.querySelector('.tab[data-tab="rlyeh"]')) return;

  const tabBar = document.getElementById("tab-bar");

  const newTab = document.createElement("div");
  newTab.className = "tab";
  newTab.dataset.tab = "rlyeh";
  newTab.innerHTML = `
    <img src="https://www.google.com/s2/favicons?sz=16&domain=eldritch.com" class="favicon">
    <span>R'LYEH</span>
    <span class="close-tab" onclick="handleTabClose('rlyeh'); event.stopPropagation();">✕</span>
  `;
  newTab.addEventListener("click", () => switchTab("rlyeh"));
  tabBar.appendChild(newTab);

  switchTab("rlyeh");
}
function setFocusedInput(el) {
  focusedInput = el;
}
//end
function handleFinalEntrance() {
  const playerName = prompt("enter your name:");
  if (!playerName) return;

  const endTime = Date.now();
  const timeSpent = Math.floor((endTime - startTime) / 1000);
  console.log(`玩家 ${playerName} 通關時間：${timeSpent} 秒`);

  // ✅ 將資料寫入 Firebase
  firebase.database().ref('leaderboard').push({
    name: playerName,
    time: timeSpent
  }).then(() => {
    console.log("✅ 資料已寫入 Firebase");
  }).catch(error => {
    console.error("❌ 寫入失敗：", error);
  });

  // 顯示影片遮罩
  const videoOverlay = document.createElement('div');
  videoOverlay.id = 'video-overlay';
  videoOverlay.innerHTML = `
    <video id="end-video" src="end.mp4" autoplay style="width: 100vw; height: 100vh; object-fit: cover;"></video>
  `;
  document.body.appendChild(videoOverlay);

  const video = document.getElementById("end-video");

  video.onended = () => {
    video.classList.add('fade-out');

    setTimeout(() => {
      videoOverlay.remove();

      const endingScreen = document.createElement('div');
      endingScreen.className = "ending-screen";
      endingScreen.innerHTML = `
        <h1>Thank you, ${playerName}！</h1>
        <p>completion time: ${timeSpent} seconds。</p>
        <h3>Development Team</h3>
        <p><br>Director 姆咪<br>Screenwriter 甲犇<br>Art 烏薩奇<br>Code moomee chatgpt</p>
        <p>special thanks to H.P. Lovecraft</p>
        <button onclick="location.reload()">back</button>
      `;

      // ✅ 讀取前 5 名排行榜
      firebase.database().ref('leaderboard').orderByChild('time').limitToFirst(5).once('value', snapshot => {
  const data = [];
  snapshot.forEach(child => {
    data.push(child.val());
  });

  let leaderboardHTML = "<h2> Leaderboard</h2><ol>";
  data.forEach(entry => {
    leaderboardHTML += `<li>${entry.name} - ${entry.time}s</li>`;
  });
  leaderboardHTML += "</ol>";

  endingScreen.innerHTML += leaderboardHTML;
});

      document.body.appendChild(endingScreen);
    }, 1500);
  };
}
document.getElementById('hint-btn').addEventListener('click', toggleHintPanel);

function toggleHintPanel() {
  const panel = document.getElementById('hint-panel');
  panel.classList.toggle('hidden');
}
function toggleHintWindow() {
  const win = document.getElementById("hint-window");
  win.classList.toggle("hidden");
}

function closeHintWindow() {
  document.getElementById("hint-window").classList.add("hidden");
}

function toggleGuideWindow() {
  const win = document.getElementById("guide-window");
  win.classList.toggle("hidden");
}

function closeGuideWindow() {
  document.getElementById("guide-window").classList.add("hidden");
} // ← ✅ 這個右大括號是你漏掉的
//firebase 
const playerRef = firebase.database().ref('leaderboard').push();
playerRef.set({
  name: playerName,
  time: timeSpent,
  timestamp: Date.now()
});