import {Link} from 'react-router-dom'
import Slider from '../components/Slider'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

function Explore() {
  return (
    <div className='explore'>
      <header>
        <p className='pageHeader'>Keşfet</p>
      </header>

      <main>
        <Slider />

        <p className="exploreCategoryHeading">Kategoriler</p>
        <div className="exploreCategories">
          <Link to='/category/rent'>
            <img  
              src={rentCategoryImage}
              alt='rent'
              className='exploreCategoryImg'
            />
            <p className="exploreCategoryName">Kiralık</p>
          </Link>
          <Link to='/category/sale'>
            <img  
              src={sellCategoryImage}
              alt='sale'
              className='exploreCategoryImg'
            />
            <p className="exploreCategoryName">Satılık</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore