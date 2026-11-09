// Brew-scene logo: a barista with dreadlocks pours from a gooseneck kettle onto a V60, coffee drips into a glass server.
// Original line illustration (SVG) + CSS keyframes (see "brew scene" in styles.css). The static state is a finished brew.
let n = 0;

const SERVER = 'M56 172H84L104 220Q106 228 96 228H44Q34 228 36 220Z';
const CONE = 'M42 124H98L82 162H58Z';

// dreadlocks: [path, pivot x, pivot y, animation delay]
const BACK = [
  ['M192 36Q210 40 212 66', 192, 36, 0],
  ['M190 42Q204 52 204 80', 190, 42, -0.6],
  ['M186 33Q206 28 218 50', 186, 33, -1.2],
  ['M194 48Q196 62 194 84', 194, 48, -1.8],
  ['M182 30Q196 20 212 32', 182, 30, -2.4],
];
const FRONT = [
  ['M156 38Q146 48 148 66', 156, 38, -0.3],
  ['M160 33Q150 38 144 52', 160, 33, -1.5],
];

const dread = ([d, x, y, delay], w) =>
  `<path class="bs-dread" d="${d}" style="transform-origin:${x}px ${y}px;animation-delay:${delay}s" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;

export function brewScene({ cls = '', label = '' } = {}) {
  const id = ++n;
  return `<svg class="bs ${cls}" viewBox="0 0 240 240" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false" stroke-linejoin="round" stroke-linecap="round">
  <defs>
    <clipPath id="bs-s${id}"><path d="${SERVER}"/></clipPath>
    <clipPath id="bs-c${id}"><path d="${CONE}"/></clipPath>
  </defs>
  <ellipse cx="72" cy="232" rx="46" ry="4" fill="currentColor" opacity=".1"/>

  <g class="bs-person" stroke="currentColor" stroke-width="3">
    <g>${BACK.map((d) => dread(d, 6.5)).join('')}</g>
    <path d="M162 76C148 92 142 140 144 220H234V150C234 110 216 84 192 72Z" fill="var(--bs-paper)"/>
    <path d="M162 76C148 92 142 140 144 220H234V150C234 110 216 84 192 72Z" fill="var(--accent)" fill-opacity=".16" stroke="none"/>
    <path d="M168 66V80M184 64V76" fill="none"/>
    <path d="M168 96C186 90 206 82 216 94C230 110 226 138 204 142C190 144 176 130 166 110Z" fill="var(--bs-paper)"/>
    <path d="M168 96C186 90 206 82 216 94C230 110 226 138 204 142C190 144 176 130 166 110Z" fill="var(--accent)" fill-opacity=".16" stroke="none"/>
    <path d="M154 50C153 34 160 28 172 28C186 28 192 38 190 52C189 62 184 70 174 70C164 70 155 62 154 50Z" fill="var(--bs-paper)"/>
    <circle cx="191" cy="54" r="4" fill="var(--bs-paper)"/>
    <path d="M158 52Q163 56 168 52M160 58L157 66H162M164 68Q168 70 172 68" fill="none" stroke-width="2.4"/>
    <path d="M153 50C150 28 168 20 184 26C198 31 197 46 192 54L187 44C177 38 164 41 157 52Z" fill="currentColor"/>
    <g>${FRONT.map((d) => dread(d, 5.5)).join('')}</g>
  </g>

  <g class="bs-server" stroke="currentColor" stroke-width="3">
    <g clip-path="url(#bs-s${id})">
      <rect class="bs-liquid" x="30" y="198" width="80" height="34" fill="#5a3219" stroke="none"/>
      <rect class="bs-liquid" x="30" y="198" width="80" height="3" fill="#8a5a33" stroke="none"/>
    </g>
    <path d="${SERVER}" fill="var(--accent)" fill-opacity=".08"/>
    <path d="M98 192H106Q114 192 114 200Q114 208 106 208H102" fill="none"/>
    <path d="M48 214Q46 208 50 202" fill="none" stroke-opacity=".4"/>
  </g>

  <g class="bs-drops">
    <circle class="bs-drop" cx="70" cy="172" r="2.4" fill="#5a3219"/>
    <circle class="bs-drop d2" cx="70" cy="172" r="2.4" fill="#5a3219"/>
    <circle class="bs-drop d3" cx="70" cy="172" r="2.4" fill="#5a3219"/>
  </g>

  <g class="bs-dripper" stroke="currentColor" stroke-width="3">
    <g clip-path="url(#bs-c${id})"><rect class="bs-bed" x="40" y="130" width="62" height="34" fill="#4a2a14" stroke="none"/></g>
    <path d="${CONE}" fill="var(--bs-paper)" fill-opacity=".35"/>
    <path d="M52 128L63 160M64 128L67 160M76 128L73 160M88 128L78 160" fill="none" stroke-width="1.8" stroke-opacity=".5"/>
    <ellipse cx="70" cy="124" rx="28" ry="5" fill="none"/>
    <path d="M96 132H104Q112 132 112 140Q112 148 104 148H90" fill="none"/>
    <rect x="46" y="162" width="48" height="8" rx="4" fill="var(--bs-paper)"/>
  </g>

  <g class="bs-steam" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="3">
    <path d="M58 112C53 105 63 101 58 93"/><path d="M72 110C67 103 77 99 72 91"/><path d="M86 112C81 105 91 101 86 93"/>
  </g>

  <path class="bs-stream" d="M73 110V134" pathLength="1" stroke="currentColor" stroke-width="3" fill="none"/>

  <g class="bs-kettle" stroke="currentColor" stroke-width="3">
    <path d="M102 106C90 106 90 91 80 91L72 95" fill="none" stroke-width="4"/>
    <path d="M143 82Q161 80 159 98Q158 108 146 108" fill="none"/>
    <path d="M100 98C100 84 110 78 123 78C136 78 146 84 146 98C146 108 140 113 123 113C106 113 100 108 100 98Z" fill="var(--bs-paper)"/>
    <path d="M102 90Q123 96 144 90M101 101Q123 107 145 101" fill="none" stroke-width="2.2"/>
    <path d="M113 78Q123 70 133 78" fill="var(--bs-paper)"/>
    <rect x="118" y="65" width="9" height="7" rx="2" fill="currentColor"/>
    <path d="M148 94Q158 87 167 93Q171 101 165 107Q156 111 148 105Z" fill="var(--bs-paper)"/>
    <path d="M154 95V103M159 94V104" fill="none" stroke-width="2"/>
  </g>
</svg>`;
}
