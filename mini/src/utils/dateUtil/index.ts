function formatTimeAgo(input: string | Date) {
  // 处理iOS兼容性问题：将日期字符串中的横杠替换为斜杠
  const date = input instanceof Date ? input : new Date(typeof input === 'string' ? input.replace(/-/g, '/') : input);
  const timestamp = date.getTime();

  // 当前时间
  const now = Date.now();
  const diff = now - timestamp;

  // 如果传入的时间是未来时间，则返回“未来时间”
  if (diff < 0) {
    return '未来时间';
  }

  // 计算时间差的各个单位
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // 判断时间差并返回相应的描述
  if (seconds < 30) {
    return '刚刚';
  }
  else if (seconds < 60) {
    return `${seconds}秒前`;
  }
  else if (minutes < 60) {
    return `${minutes}分钟前`;
  }
  else if (hours < 24) {
    return `${hours}小时前`;
  }
  // else if (days === 1) {
  //   return '昨天';
  // }
  // else if (days === 2) {
  //   return '前天';
  // }
  else if (days <= 7) {
    return `${days}天前`;
  }
  else {
    // 超过一周，显示具体日期
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
}

// utils/date.js
function formatChatTime(timestamp: number | string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const msgDate = new Date(timestamp);

  // 时间差计算（毫秒）
  const timeDiff = now.getTime() - msgDate.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // 当天消息（今天）
  if (msgDate >= today) {
    return formatTime(msgDate);
  }
  // 昨天
  else if (msgDate < today && msgDate >= yesterday) {
    return `昨天 ${formatTime(msgDate)}`;
  }
  // 本周内（2-6天前）
  else if (dayDiff < 7) {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    return `周${weekDays[msgDate.getDay()]} ${formatTime(msgDate)}`;
  }
  // 今年内
  else if (msgDate.getFullYear() === now.getFullYear()) {
    return `${msgDate.getMonth() + 1}月${msgDate.getDate()}日 ${formatTime(msgDate)}`;
  }
  // 跨年
  else {
    return `${msgDate.getFullYear()}年${msgDate.getMonth() + 1}月${msgDate.getDate()}日 ${formatTime(msgDate)}`;
  }
}

// 格式化时间 (HH:mm)
function formatTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export { formatChatTime, formatTimeAgo };
