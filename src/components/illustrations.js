import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { colors, topicColors } from '../theme';

const INK = '#3B2F2A';

// ---------------------------------------------------------------------------
// Jeru si Jeruk: maskot LiterasiGizi (gambar orisinal).
// mood: happy | wow | think | sad | party
// ---------------------------------------------------------------------------
export function Mascot({ size = 120, mood = 'happy' }) {
  const eyes = {
    happy: (
      <G>
        <Ellipse cx="47" cy="63" rx="5" ry="6.5" fill={INK} />
        <Ellipse cx="73" cy="63" rx="5" ry="6.5" fill={INK} />
        <Circle cx="48.8" cy="60.5" r="1.8" fill="#fff" />
        <Circle cx="74.8" cy="60.5" r="1.8" fill="#fff" />
      </G>
    ),
    wow: (
      <G>
        <Circle cx="46" cy="61" r="7" fill={INK} />
        <Circle cx="74" cy="61" r="7" fill={INK} />
        <Circle cx="48.5" cy="58.5" r="2.4" fill="#fff" />
        <Circle cx="76.5" cy="58.5" r="2.4" fill="#fff" />
      </G>
    ),
    think: (
      <G>
        <Ellipse cx="49" cy="59" rx="4.5" ry="6" fill={INK} />
        <Ellipse cx="75" cy="59" rx="4.5" ry="6" fill={INK} />
        <Circle cx="50.5" cy="56.5" r="1.6" fill="#fff" />
        <Circle cx="76.5" cy="56.5" r="1.6" fill="#fff" />
      </G>
    ),
    sad: (
      <G>
        <Ellipse cx="47" cy="64" rx="4.5" ry="5.5" fill={INK} />
        <Ellipse cx="73" cy="64" rx="4.5" ry="5.5" fill={INK} />
        <Path d="M40 54 L52 57" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <Path d="M80 54 L68 57" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </G>
    ),
    party: (
      <G>
        <Path d="M41 64 Q47 56 53 64" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        <Path d="M67 64 Q73 56 79 64" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      </G>
    ),
  }[mood];

  const mouth = {
    happy: <Path d="M50 77 Q60 87 70 77" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />,
    wow: <Ellipse cx="60" cy="81" rx="6" ry="7" fill={INK} />,
    think: <Path d="M53 79 Q60 84 67 78" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />,
    sad: <Path d="M51 84 Q60 77 69 84" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />,
    party: (
      <G>
        <Path d="M47 75 Q60 94 73 75 Z" fill={INK} />
        <Path d="M54 84 Q60 89 66 84 Q60 81 54 84 Z" fill="#FF7EA6" />
      </G>
    ),
  }[mood];

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Ellipse cx="60" cy="113" rx="30" ry="5" fill="#000" opacity="0.08" />
      {mood === 'party' ? (
        <G>
          <Path d="M22 62 Q10 50 12 36" stroke={colors.orangeDark} strokeWidth="6" strokeLinecap="round" fill="none" />
          <Path d="M98 62 Q110 50 108 36" stroke={colors.orangeDark} strokeWidth="6" strokeLinecap="round" fill="none" />
        </G>
      ) : null}
      {/* tangkai dan daun */}
      <Path d="M60 26 C60 18 63 12 68 9" stroke="#8A5A33" strokeWidth="4" strokeLinecap="round" fill="none" />
      <Path
        d="M64 16 C71 4 88 5 91 12 C84 21 71 23 64 16 Z"
        fill="#7ACB55"
        stroke="#3E9A34"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Path d="M68 15 C75 12 82 11 87 12" stroke="#3E9A34" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* badan */}
      <Circle cx="60" cy="67" r="42" fill={colors.orange} stroke={colors.orangeDark} strokeWidth="4" />
      <Path d="M32 52 C36 42 44 36 53 33" stroke="#FFD3A1" strokeWidth="6" strokeLinecap="round" fill="none" />
      <Circle cx="84" cy="88" r="1.8" fill={colors.orangeDark} opacity="0.5" />
      <Circle cx="90" cy="80" r="1.5" fill={colors.orangeDark} opacity="0.5" />
      <Circle cx="30" cy="84" r="1.5" fill={colors.orangeDark} opacity="0.5" />
      {/* pipi */}
      <Ellipse cx="37" cy="75" rx="7" ry="4.5" fill="#FF7EA6" opacity="0.55" />
      <Ellipse cx="83" cy="75" rx="7" ry="4.5" fill="#FF7EA6" opacity="0.55" />
      {eyes}
      {mouth}
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Stiker makanan per topik modul (gambar orisinal, sederhana).
// ---------------------------------------------------------------------------
function TinyFace({ x, y, scale = 1 }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${scale})`}>
      <Circle cx="-5" cy="0" r="2" fill={INK} />
      <Circle cx="5" cy="0" r="2" fill={INK} />
      <Path d="M-4 5 Q0 8.5 4 5" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </G>
  );
}

const STICKER_ART = {
  // Isi Piringku: piring dengan empat kelompok makanan.
  jajanan: (
    <G>
      <Circle cx="50" cy="52" r="26" fill="#fff" stroke={INK} strokeWidth="3" />
      <Path d="M50 52 L50 26 A26 26 0 0 1 76 52 Z" fill="#7ACB55" />
      <Path d="M50 52 L76 52 A26 26 0 0 1 50 78 Z" fill="#FFB347" />
      <Path d="M50 52 L50 78 A26 26 0 0 1 24 52 Z" fill="#FFF3D6" />
      <Path d="M50 52 L24 52 A26 26 0 0 1 50 26 Z" fill="#FF8C8C" />
      <Circle cx="50" cy="52" r="26" fill="none" stroke={INK} strokeWidth="3" />
      <Circle cx="50" cy="52" r="18" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7" />
    </G>
  ),
  // Wortel
  'sayur-buah': (
    <G>
      <Path d="M44 26 C40 16 46 12 50 22 C52 12 60 12 56 24 C64 18 68 24 58 28 Z" fill="#7ACB55" stroke="#3E9A34" strokeWidth="2.5" strokeLinejoin="round" />
      <Path d="M36 34 C44 26 62 26 66 34 C66 50 56 70 50 80 C44 70 34 50 36 34 Z" fill="#FF9F43" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Path d="M42 52 L48 51 M54 62 L58 60" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <TinyFace x={51} y={40} />
    </G>
  ),
  // Telur mata sapi
  protein: (
    <G>
      <Path d="M28 50 C24 34 40 24 52 28 C66 22 80 34 74 50 C80 64 66 78 50 74 C34 80 22 66 28 50 Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Circle cx="51" cy="52" r="15" fill="#FFC93C" stroke={INK} strokeWidth="3" />
      <Path d="M44 45 Q47 42 51 42" stroke="#FFF2C8" strokeWidth="3" strokeLinecap="round" fill="none" />
      <TinyFace x={51} y={53} scale={0.9} />
    </G>
  ),
  // Tetes air
  'air-putih': (
    <G>
      <Path d="M50 20 C58 34 72 46 72 60 C72 73 62 80 50 80 C38 80 28 73 28 60 C28 46 42 34 50 20 Z" fill="#6EC1F7" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Path d="M38 56 C38 48 42 42 46 38" stroke="#E1F2FE" strokeWidth="4" strokeLinecap="round" fill="none" />
      <TinyFace x={51} y={62} />
    </G>
  ),
  // Gelas minuman manis dengan sedotan
  'minuman-manis': (
    <G>
      <Path d="M58 30 L64 14 L70 15" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M32 32 L68 32 L63 78 C62 81 60 82 57 82 L43 82 C40 82 38 81 37 78 Z" fill="#FF9CBD" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Path d="M33.5 44 L66.5 44" stroke="#fff" strokeWidth="3" opacity="0.8" />
      <Rect x="40" y="22" width="10" height="10" rx="2" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <TinyFace x={50} y={60} />
    </G>
  ),
  // Kotak dengan label gizi
  'label-gizi': (
    <G>
      <Rect x="28" y="22" width="44" height="58" rx="6" fill="#B38CF5" stroke={INK} strokeWidth="3" />
      <Rect x="35" y="32" width="30" height="38" rx="3" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <Path d="M40 40 L60 40 M40 47 L56 47 M40 54 L60 54 M40 61 L52 61" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </G>
  ),
};

export function TopicSticker({ topic, size = 64, locked }) {
  const tone = topicColors[topic] || topicColors.jajanan;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={locked ? 0.45 : 1}>
      <Circle cx="50" cy="53" r="45" fill={locked ? colors.locked : tone.dark} />
      <Circle cx="50" cy="49" r="45" fill={locked ? colors.lockedSoft : tone.bg} stroke="#fff" strokeWidth="4" />
      {STICKER_ART[topic] || STICKER_ART.jajanan}
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Dekorasi kecil
// ---------------------------------------------------------------------------
export function Sparkle({ size = 18, color = colors.yellow }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 1 C13 8 16 11 23 12 C16 13 13 16 12 23 C11 16 8 13 1 12 C8 11 11 8 12 1 Z" fill={color} />
    </Svg>
  );
}

// Tepi bawah bergelombang untuk area header berwarna.
export function Wave({ color, width = 400, height = 28 }) {
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <Path
        d={`M0 0 L${width} 0 L${width} ${height * 0.45} C${width * 0.85} ${height} ${width * 0.65} ${height * 0.1} ${width * 0.5} ${height * 0.55} C${width * 0.35} ${height} ${width * 0.15} ${height * 0.15} 0 ${height * 0.6} Z`}
        fill={color}
      />
    </Svg>
  );
}

// Bulatan avatar anak berbentuk buah, warnanya dipilih dari nama.
const AVATAR_TONES = [colors.orange, colors.pink, colors.primary, colors.sky, colors.yellow, colors.purple];
export function FruitAvatar({ name = '?', size = 52 }) {
  const code = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const fill = AVATAR_TONES[code % AVATAR_TONES.length];
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Path d="M30 10 C30 6 32 3 35 2" stroke="#8A5A33" strokeWidth="3" strokeLinecap="round" fill="none" />
      <Path d="M32 7 C36 1 45 2 46 6 C42 10 36 11 32 7 Z" fill="#7ACB55" stroke="#3E9A34" strokeWidth="2" />
      <Circle cx="30" cy="34" r="23" fill={fill} stroke={INK} strokeWidth="2.5" />
      <Circle cx="23" cy="32" r="2.6" fill={INK} />
      <Circle cx="37" cy="32" r="2.6" fill={INK} />
      <Path d="M24 40 Q30 45 36 40" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Ellipse cx="18" cy="39" rx="3.5" ry="2.2" fill="#fff" opacity="0.5" />
      <Ellipse cx="42" cy="39" rx="3.5" ry="2.2" fill="#fff" opacity="0.5" />
    </Svg>
  );
}
