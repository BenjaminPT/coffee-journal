// Brew-scene logo: a barista with dreadlocks pours from a gooseneck kettle onto a V60, coffee drips into a glass server.
// Original line illustration (SVG) + CSS keyframes (see "brew scene" in styles.css). The static state is a finished brew.
let n = 0;

const SERVER = 'M56 172H84L104 220Q106 228 96 228H44Q34 228 36 220Z';
const CONE = 'M42 124H98L82 162H58Z';

// dreadlocks: [path, pivot x, pivot y, animation delay]
const BACK = [
  ['M194 30Q212 36 214 68', 194, 30, 0],
  ['M196 38Q208 54 208 90', 196, 38, -0.7],
  ['M190 26Q210 22 222 46', 190, 26, -1.4],
  ['M198 46Q200 66 198 98', 198, 46, -2.1],
  ['M184 22Q200 12 216 26', 184, 22, -2.8],
];
const FRONT = [
  ['M192 34Q199 50 195 76', 192, 34, -0.4],
  ['M187 29Q192 46 188 66', 187, 29, -1.6],
  ['M160 24Q150 20 145 30', 160, 24, -2.2],
];

const dread = ([d, x, y, delay], w) =>
  `<g class="bs-dread" style="transform-origin:${x}px ${y}px;animation-delay:${delay}s"><path d="${d}" stroke="currentColor" stroke-width="${w}" fill="none"/><path d="${d}" stroke="var(--bs-paper)" stroke-opacity=".5" stroke-width="1.4" stroke-dasharray="1.2 4.6" fill="none"/></g>`;

// limb drawn as an outlined tube
const tube = (d, w = 11) => `<path d="${d}" stroke="currentColor" stroke-width="${w + 5}" fill="none"/><path d="${d}" stroke="var(--bs-paper)" stroke-width="${w - 1}" fill="none"/>`;

export function brewScene({ cls = '', label = '' } = {}) {
  const id = ++n;
  return `<svg class="bs ${cls}" viewBox="0 0 240 240" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false" stroke-linejoin="round" stroke-linecap="round">
  <defs>
    <clipPath id="bs-s${id}"><path d="${SERVER}"/></clipPath>
    <clipPath id="bs-c${id}"><path d="${CONE}"/></clipPath>
  </defs>
  <ellipse cx="72" cy="232" rx="46" ry="4" fill="currentColor" opacity=".1"/>

  <g class="bs-person" stroke="currentColor" stroke-width="3">
    <g class="bs-hair-back">${BACK.map((d) => dread(d, 6.5)).join('')}</g>
    <path d="M168 70V86M186 68V84" fill="none"/>
    <path d="M160 78H208L210 92H158Z" fill="var(--bs-paper)" stroke="none"/>
    <!-- oversized tank top -->
    <path d="M160 84C168 98 164 110 162 124C157 156 153 190 153 224H229C229 190 226 156 217 122C214 108 214 96 208 84C202 92 194 96 184 96C174 96 166 92 160 84Z" fill="var(--bs-paper)"/>
    <path d="M160 84C168 98 164 110 162 124C157 156 153 190 153 224H229C229 190 226 156 217 122C214 108 214 96 208 84C202 92 194 96 184 96C174 96 166 92 160 84Z" fill="var(--accent)" fill-opacity=".18" stroke="none"/>
    <path d="M158 214H224M174 142Q178 170 172 198" fill="none" stroke-width="2" stroke-opacity=".35"/>
    <!-- far arm, relaxed (in front of the tank) -->
    ${tube('M207 96C223 120 225 148 218 172', 10)}
    <path d="M211 170Q210 182 218 184Q227 184 226 174Q225 166 218 166Z" fill="var(--bs-paper)"/>
    <!-- near arm: upper part (static) -->
    ${tube('M182 96L198 134', 11)}
    <g class="bs-head">
      <path d="M155 48C155 30 164 24 176 24C190 24 198 34 197 50C196 64 188 75 177 75C165 75 156 64 155 50Z" fill="var(--bs-paper)"/>
      <circle cx="194" cy="55" r="4.5" fill="var(--bs-paper)"/>
      <path d="M155 50L149 59L156 60" fill="var(--bs-paper)"/>
      <path d="M158 50Q162.5 54 167 50M174 50Q178.5 53.5 183 50M158 43Q163 40 168 43M174 42Q179 39 184 42M161 66Q166 68.5 171 66" fill="none" stroke-width="2.4"/>
      <circle cx="170" cy="59" r="3.2" fill="var(--accent)" fill-opacity=".35" stroke="none"/>
      <path d="M153 46C150 22 168 13 186 18C202 24 202 44 197 54L194 40C186 32 170 32 160 44Z" fill="currentColor"/>
      <g class="bs-hair-front">${FRONT.map((d) => dread(d, 5.5)).join('')}</g>
    </g>
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

  <path class="bs-stream" d="M69 114V138" pathLength="1" stroke="currentColor" stroke-width="3" fill="none"/>

  <g class="bs-kettle" stroke="currentColor" stroke-width="3">
    ${tube('M198 134L170 110', 11)}
    <circle cx="198" cy="134" r="5.6" fill="var(--bs-paper)" stroke="none"/>
    <path d="M102 106C90 106 90 91 80 91L72 95" fill="none" stroke-width="4"/>
    <path d="M143 82Q161 80 159 98Q158 108 146 108" fill="none"/>
    <path d="M100 98C100 84 110 78 123 78C136 78 146 84 146 98C146 108 140 113 123 113C106 113 100 108 100 98Z" fill="var(--bs-paper)"/>
    <path d="M102 90Q123 96 144 90M101 101Q123 107 145 101" fill="none" stroke-width="2.2"/>
    <path d="M113 78Q123 70 133 78" fill="var(--bs-paper)"/>
    <rect x="118" y="65" width="9" height="7" rx="2" fill="currentColor"/>
    <path d="M148 94Q158 87 168 93Q173 102 167 108Q158 112 148 105Z" fill="var(--bs-paper)"/>
    <path d="M154 95V104M159 93.5V104.5M164 94V104" fill="none" stroke-width="2"/>
    <path d="M168 101Q176 100 175 108" fill="none" stroke-width="2.4"/>
  </g>
</svg>`;
}
