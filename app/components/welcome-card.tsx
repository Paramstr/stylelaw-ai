const WelcomeCard = () => {
    return (
      <div className="w-full max-w-4xl mx-auto mb-16">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-medium tracking-wide text-black mb-4">
              Donna Research Preview
            </h2>
            <p className="text-gray-800 text-base leading-relaxed">
              Explore <span className="font-semibold">2,781</span> New Zealand family court cases using natural language search. 
            </p>
          </div>
  
          <p className="text-gray-700 text-base leading-relaxed">
            Experiment with different queries across various themes. Each search result includes
            <span className="font-semibold text-gray-800"> numbered references </span> 
            that link directly to source paragraphs, helping you trace information to its origin.
          </p>
  
          <div className="mt-8">
            <p className="uppercase text-sm tracking-wider text-gray-600 font-medium mb-3">Important Notes</p>
            <ul className="space-y-2.5 text-base text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Case analysis may take some time
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                If you encounter any issues, simply refresh the page
              </li>
              
            </ul>
          </div>
  
        </div>
        <div className="pt-4">
          <div className="flex items-center justify-left gap-1.5 text-sm">
            <span className="text-gray-400">-</span>
            <span className="font-medium text-gray-600">Param</span>
          </div>
        </div>
      </div>
    )
  }
  
  export default WelcomeCard