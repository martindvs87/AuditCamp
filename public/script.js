let segments = [];
let index = 0;

function showSegment() {
  if (segments.length === 0) return;
  const seg = segments[index];
  document.getElementById('segment').textContent = `${seg.category}: ${seg.text}`;
}

document.getElementById('openModal').onclick = () => {
  document.getElementById('modal').style.display = 'block';
};

document.getElementById('analyze').onclick = async () => {
  const text = document.getElementById('rawText').value;
  const res = await fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  segments = data.segments || [];
  index = 0;
  document.getElementById('modal').style.display = 'none';
  document.getElementById('results').style.display = 'block';
  showSegment();
};

document.getElementById('prev').onclick = () => {
  if (index > 0) { index--; showSegment(); }
};

document.getElementById('next').onclick = () => {
  if (index < segments.length - 1) { index++; showSegment(); }
};
