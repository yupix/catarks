import sharp from 'sharp';
import { getCDNUrl } from './utils';

export const generateSvg = async ({
  title='',
  image='',
  subtitle='',
}) => {
  const res = await fetch('https://raw.githubusercontent.com/r-40021/noto-sans-jp/main/WOFF/NotoSansJP-Medium.woff');
  const font = await res.arrayBuffer();

  const {default: satori} = await import('satori');
  const svg = await satori(
      <div 
          style={{
              background: 'white',
              width: '100%',
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
          }}
      >
          <img src={getCDNUrl(image, {format: 'png', size: '70x70'})} />
          <p>{title}</p>
      </div>,
      {
        width: 1200,
        height: 600,
        embedFont: true,
        fonts: [
          {
              name: 'NotoSansJapanese',
              data: font,
              weight: 400,
              style: 'normal',
          }
        ],
      },
    )
  const base64 = (await (sharp(Buffer.from(svg)).png().toBuffer())).toString('base64')
  return `data:image/png;base64,${base64}`
}