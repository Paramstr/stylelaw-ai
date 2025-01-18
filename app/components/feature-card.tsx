interface FeatureCardProps {
  label: string
  title: string
  description: string
  className?: string
  dark?: boolean
  alignRight?: boolean
  onClick?: () => void
  tryButtonPosition?: 'left' | 'right'
  tryButtonText?: string
}

export function FeatureCard({ 
  label, 
  title, 
  description, 
  className = "", 
  dark = false, 
  alignRight = false,
  onClick,
  tryButtonPosition = 'right',
  tryButtonText = 'Try'
}: FeatureCardProps) {
  const CardWrapper = onClick ? 'button' : 'div';
  
  return (
    <CardWrapper 
      className={`p-6 rounded-sm w-full max-w-md ${dark ? 'bg-black text-white' : 'bg-white text-black'} ${className} ${
      onClick ? 'cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 group' : ''
    } relative`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {onClick && (
        <div className={`absolute top-2 ${tryButtonPosition === 'left' ? 'left-2' : 'right-2'}`}>
          <span className={`px-3 py-1 text-sm font-semibold border ${dark ? 'border-white' : 'border-black'} rounded-sm transition-colors ${
  onClick 
    ? dark
      ? 'group-hover:bg-white group-hover:text-black'
      : 'group-hover:bg-black group-hover:text-white'
    : ''
}`}>
            {tryButtonText}
          </span>
        </div>
      )}
      <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'} mb-2 ${alignRight ? 'text-right' : ''}`}>{label}</div>
      <h2 className={`text-2xl font-serif mb-3 ${alignRight ? 'text-right' : ''}`}>{title}</h2>
      <p className={`${dark ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}>{description}</p>
    </CardWrapper>
  )
}

