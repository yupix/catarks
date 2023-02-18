export function Footer() {
  return (
    <footer className="bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-900">
      <div className="sm:grid grid-cols-2">
        {/* <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8 mr-3"
            alt="Flowbite Logo"
          /> */}
        <div className="mb-2">
          <p className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            CatArks
          </p>
          <p className="text-gray-500">
            本サイト内で使用している画像や文章データは株式会社セガに帰属します。（C）SEGA
            <br />
            また、画像、動画は公式サイト、および公式が配信したものの他、ゲーム内画像が含まれます。
            <br />
            『ファンタシースターオンライン2 ニュージェネシス』公式サイト
            <br />
            <a href="https://new-gen.pso2.jp/">https://new-gen.pso2.jp/</a>
          </p>
        </div>
        <div>
          <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div></div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
        &copy; 2023{" "}
        <a href="https://flowbite.com/" className="hover:underline">
          catarks.org
        </a>
        . All Rights Reserved.
      </span>
    </footer>
  );
}
