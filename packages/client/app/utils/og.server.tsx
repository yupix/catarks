import sharp from 'sharp';

export const generateSvg = async ({
  title='',
  subtitle='',
}) => {
  const res = await fetch('https://codedgeekery.com/fonts/hack/woff/hack-regular.woff');
  const font = await res.arrayBuffer();

  const {default: satori} = await import('satori');
  const svg = await satori(
      <div 
          style={{
              fontSize: 128,
              fontFamily: 'Hack',
              background: 'white',
              width: '100%',
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
          }}
      >
          {title}
      </div>,
      {
        width: 1200,
        height: 600,
        embedFont: false,
        fonts: [
          {
              name: 'Hack',
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