// Brew-scene illustration: a Fellow Stagg-style gooseneck kettle pours onto a V60 dripper, coffee drips into a Hario-style glass server.
// Pure SVG + CSS keyframes (see "brew scene" in styles.css). Without animation the static state is a finished brew.
let n = 0;

const SERVER = 'M92 146H148L146 158C146 164 158 166 160 174V212Q160 224 148 224H92Q80 224 80 212V174C82 166 94 164 94 158Z';
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
      <rect class="bs-liquid" x="60" y="180" width="120" height="48" fill="#5a3219"/>
      <rect class="bs-liquid" x="60" y="180" width="120" height="3" fill="#8a5a33"/>
    </g>
    <path d="${SERVER}" fill="var(--accent)" fill-opacity=".08" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M88 186V208" stroke="currentColor" stroke-opacity=".3" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M80 190H88M80 200H86M80 210H88" stroke="currentColor" stroke-opacity=".35" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M160 178H172Q180 178 180 186V204Q180 212 172 212H160" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
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
    <path d="M86 72C104 72 98 46 112 42L124 47" stroke="var(--primary)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M40 40H27Q22 40 22 45V65Q22 70 27 70H40" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="40" y="35" width="46" height="46" rx="5" fill="var(--primary)"/>
    <rect x="37" y="80" width="52" height="7" rx="3" fill="currentColor"/>
    <rect x="42" y="31" width="42" height="5" rx="2.5" fill="var(--primary)"/>
    <rect x="57" y="25" width="12" height="7" rx="3.5" fill="currentColor"/>
    <path d="M40 48H86" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
    <path d="M47 56V72" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round" fill="none"/>
  </g>
</svg>`;
}
