
export function Footer() {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
      <div>
        <p className="font-bold">CatArks</p>
        本サイト内で使用している画像や文章データは株式会社セガに帰属します。（C）SEGA
        <br />
        また、画像、動画は公式サイト、および公式が配信したものの他、ゲーム内画像が含まれます。
        <br />
        『ファンタシースターオンライン2 ニュージェネシス』公式サイト
        <br />
        <a href="https://new-gen.pso2.jp/">https://new-gen.pso2.jp/</a>
        <p>&copy; 2023 catarks.org</p>
      </div>
      <div>
        <span className="footer-title">Services</span>
        <a className="link link-hover" href={"https://nr.akarinext.org"}>
          Misskey
        </a>
      </div>
      <div>
        <span className="footer-title">Contact</span>
        <a className="link link-hover" href="https://discord.gg/CcT997U">
          Discord
        </a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </div>
    </footer>
  );
}
