
import React, { useContext } from 'react';
import { OBDProduct } from '../../types';
import Button from './Button';
import { LanguageContext } from '../../App';
import { CheckCircleIcon, InformationCircleIcon } from './Icon'; // Changed ShoppingCartIcon

interface ProductCardProps {
  product: OBDProduct;
  onRequestInfo: (product: OBDProduct) => void; // Changed from onAddToCart
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onRequestInfo }) => {
  const { translate } = useContext(LanguageContext);

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-emerald-500/20 hover:ring-1 hover:ring-emerald-500">
      <div className="relative h-48 sm:h-56 w-full">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 truncate" title={product.name}>
          {product.name}
        </h3>
        <p className="text-sky-400 font-bold text-xl sm:text-2xl mb-3">
          {/* Price display can be controlled by a translation key for flexibility */}
          {product.price > 0 ? translate('obdPriceDisplay', 'Price: {price} RWF', {price: product.price.toLocaleString()}) : translate('priceOnRequest', 'Price on Request')}
        </p>
        <p className="text-slate-400 text-xs sm:text-sm mb-3 flex-grow min-h-[3rem]">
          {product.description}
        </p>
        
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-1">{translate('features', 'Features')}:</h4>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="truncate" title={feature}>
                  <CheckCircleIcon className="w-3 h-3 inline mr-1 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button 
          variant="primary" 
          size="md"
          fullWidth
          onClick={() => onRequestInfo(product)} // Changed from onAddToCart
          leftIcon={<InformationCircleIcon className="w-4 h-4"/>} // Changed icon
          className="mt-auto"
        >
          {translate('requestInfo', 'Request Info')} {/* Changed text */}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
