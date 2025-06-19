import React from 'react';
import { ServiceCardProps, AppView } from '../types'; // AppView might not be directly used here if onAction handles navigation
import Button from './common/Button';
import { LanguageContext } from '../App'; // If title/description need translation

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  icon,
  actionText,
  onAction, // This function will handle navigation or other actions
  bgColorClass = 'bg-slate-800', // Updated default background
  textColorClass = 'text-slate-300', // Updated default text color
  highlight = false,
}) => {
  const { translate } = React.useContext(LanguageContext); // For potential future use if card content is dynamic

  // Title and description could be translation keys
  const cardTitle = title; // translate(title) if title is a key
  const cardDescription = description; // translate(description) if description is a key

  return (
    <div 
      className={`
        ${bgColorClass} 
        p-6 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
        flex flex-col h-full group
        ${highlight ? 'ring-2 ring-emerald-500 shadow-emerald-500/30' : 'ring-1 ring-slate-700'}
      `}
    >
      <div className="flex-shrink-0 mb-5 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-10 h-10 md:w-12 md:h-12' })}
      </div>
      <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{cardTitle}</h3>
      {price && <p className="text-2xl font-extrabold text-sky-400 mb-3">{price}</p>}
      <p className={`${textColorClass} text-sm lg:text-base mb-6 flex-grow`}>{cardDescription}</p>
      <Button 
        onClick={onAction} 
        variant={highlight ? 'primary' : 'secondary'} 
        size="md"
        className="mt-auto w-full group-hover:bg-opacity-90"
        aria-label={`${actionText} for ${cardTitle}`}
      >
        {actionText}
      </Button>
    </div>
  );
};

export default ServiceCard;
