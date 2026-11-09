// Brew-scene illustration: a gooseneck kettle pours onto a V60 dripper, coffee drips into the server.
// Pure SVG + CSS keyframes (see "brew scene" in styles.css). Without animation the static state is a finished brew.
let n = 0;

const SERVER = 'M96 146H144L148 164C162 172 166 184 166 196V212Q166 224 154 224H86Q74 224 74 212V196C74 184 78 172 92 164Z';
const CONE = 'M64 78H176L138 140H102Z';

export function brewScene({ cls = '', label = '' } = {}) {
  const id = ++n;
  return `<svg class="bs ${cls}" viewBox="0 0 240 240" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false">
  <defs>
    <clipPath id="bs-s${id}"><path d="${SERVER}"/></clipPath>
    <clipPath id="bs-c${id}"><path d="${CONE}"/></clipPath>
  </defs>
  <ellipse cx="120" cy="230" rx="64" ry="5" fill="currentColor" opacity=".1"/>

  <g class="bs-server">
    <g clip-path="url(#bs-s${id})">
      <rect class="bs-liquid" x="60" y="176" width="120" height="52" fill="#5a3219"/>
      <rect class="bs-liquid" x="60" y="176" width="120" height="3" fill="#8a5a33"/>
    </g>
    <path d="${SERVER}" fill="var(--accent)" fill-opacity=".08" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M84 192C84 186 86 182 90 178" stroke="currentColor" stroke-opacity=".3" stroke-width="3" stroke-linecap="round" fill="none"/>
  </g>

  <g class="bs-drops">
    <circle class="bs-drop" cx="120" cy="150" r="2.6" fill="#5a3219"/>
    <circle class="bs-drop d2" cx="120" cy="150" r="2.6" fill="#5a3219"/>
    <circle class="bs-drop d3" cx="120" cy="150" r="2.6" fill="#5a3219"/>
  </g>

  <g class="bs-dripper">
    <g clip-path="url(#bs-c${id})"><rect class="bs-bed" x="60" y="96" width="120" height="46" fill="#4a2a14"/></g>
    <path d="${CONE}" fill="var(--accent)" fill-opacity=".12" stroke="var(--accent)" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M82 80L110 138M104 80L116 138M136 80L124 138M158 80L130 138" stroke="var(--accent)" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <path d="M58 78H182" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/>
    <rect x="98" y="140" width="44" height="7" rx="3.5" fill="var(--accent)"/>
  </g>

  <g class="bs-steam" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="3" stroke-linecap="round">
    <path d="M104 66C98 58 110 54 104 44"/><path d="M122 64C116 56 128 52 122 42"/><path d="M140 66C134 58 146 54 140 44"/>
  </g>

  <path class="bs-stream" d="M124 50V102" pathLength="1" stroke="#7cc4ec" stroke-width="3.6" stroke-linecap="round" fill="none"/>

  <g class="bs-kettle">
    <path d="M88 66C106 66 100 44 114 42L124 47" stroke="var(--primary)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M42 44C26 44 26 68 42 68" stroke="var(--primary)" stroke-width="5" stroke-linecap="round" fill="none"/>
    <rect x="38" y="34" width="54" height="42" rx="15" fill="var(--primary)"/>
    <rect x="52" y="27" width="26" height="8" rx="4" fill="var(--primary)"/>
    <circle cx="65" cy="24" r="4.5" fill="var(--primary)"/>
    <path d="M48 46C48 42 51 40 55 40" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round" fill="none"/>
  </g>
</svg>`;
}
