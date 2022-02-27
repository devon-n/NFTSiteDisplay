import Link from 'next/link'


const Nav = () => {

    function toggleDropDown() {
        const menu = document.getElementById('menu')
        menu.classList.toggle('hidden')
    
        const openMenu = document.getElementById('openMenu')
        openMenu.classList.toggle('hidden')
    
        const closeMenu = document.getElementById('closeMenu')
        closeMenu.classList.toggle('hidden')
      }

    return (
        <div>
            <nav className="hidden p-6 bg-orange-300 border-b md:block">
            <p className="text-4xl font-bold">WEBSITE HEADING</p>
            <div className="flex mt-4">
                <Link href="/" passHref>
                <div className="px-3 py-2 mr-4 text-white transition-colors duration-300 cursor-pointer hover:bg-orange-100 hover:text-orange-400 rounded-xl">
                    Home
                </div>
                </Link>
                <Link href="/create-nft" passHref>
                <div className="px-3 py-2 mr-4 text-white transition-colors duration-300 cursor-pointer hover:bg-orange-100 hover:text-orange-400 rounded-xl">
                    Create NFT
                </div>
                </Link>
                <Link href="/your-nfts" passHref>
                <div className="px-3 py-2 mr-4 text-white transition-colors duration-300 cursor-pointer hover:bg-orange-100 hover:text-orange-400 rounded-xl">
                    Your NFTs
                </div>
                </Link>
                <Link href="/all-nfts" passHref>
                <div className="px-3 py-2 mr-4 text-white transition-colors duration-300 cursor-pointer hover:bg-orange-100 hover:text-orange-400 rounded-xl">
                    All NFTs
                </div>
                </Link>
                {/* <Link href="/contact" passHref>
                <div className="px-3 py-2 mr-4 text-white transition-colors duration-300 hover:bg-orange-100 hover:text-orange-400 rounded-xl">
                    Contact Us
                </div>
                </Link> */}
            </div>      
            </nav>


            <svg className="absolute hidden transition duration-200 ease-in-out cursor-pointer md:hidden" 
            id="closeMenu" style={{ "right" : "8px", "top":"20px"}} width="30" height="30" 
            viewBox="0 0 50 50" 
            stroke="#60A5FA" strokeWidth="10" strokeLinecap="round"
            onClick={toggleDropDown}>
            <line x2="50" y2="50" />
            <line x1="50" y2="50" />
            </svg>

            <svg className="absolute transition duration-200 ease-in-out cursor-pointer md:hidden" 
            style={{ "right" : "5px", "top":"20px"}} onClick={toggleDropDown} 
            id="openMenu" viewBox="0 0 10 8" width="40" height="40"
            >
                <path d='M1 1h8M1 4h 8M1 7h8' 
                stroke='#60A5FA' 
                strokeWidth='2' 
                strokeLinecap='round'
                className="place-items-end"/>
            </svg >

            <div id="menu" className="grid hidden grid-cols-1 transition duration-200 ease-in-out border-b md:hidden" onClick={toggleDropDown}>     
            <nav className="container grid max-w-6xl grid-cols-1 mx-auto mt-16 text-right">
                <Link href="/" passHref>
                <div className="p-3 transition-colors duration-300 text-cw-orange-600 hover:text-orange-050 hover:bg-orange-200">
                    Home
                </div>
                </Link>
                <Link href="/create-nft" passHref>
                <div className="p-3 transition-colors duration-300 text-cw-orange-600 hover:text-orange-050 hover:bg-orange-200">
                    Create NFT
                </div>
                </Link>
                <Link href="/your-nfts" passHref>
                <div className="p-3 transition-colors duration-300 text-cw-orange-600 hover:text-orange-050 hover:bg-orange-200">
                    Your NFTs
                </div>
                </Link>
                <Link href="/all-nfts" passHref>
                <div className="p-3 transition-colors duration-300 text-cw-orange-600 hover:text-orange-050 hover:bg-orange-200">
                    All NFTs
                </div>
                </Link>
                {/* <Link href="/contact" passHref>
                <div className="p-3 transition-colors duration-300 text-cw-orange-600 hover:text-orange-050 hover:bg-orange-200">
                    Contact Us
                </div>
                </Link> */}
            </nav>
            </div>
        </div>
    )
}

export default Nav