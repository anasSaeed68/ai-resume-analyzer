import React, { useEffect } from 'react'

const ScoreGauge = ({score}:{score:number}) => {
  const [pathLength, setPathLength] = React.useState(0);
  const circleRef = React.useRef<SVGCircleElement>(null);
  const percentage = score / 100;
  
  useEffect(()=>{
    if(circleRef.current) {
      setPathLength(circleRef.current.getTotalLength());
    }
  },[]);

  return (
    <div className='flex flex-col items-center'>

      <div className='relative w-40 h-20'>
        {/* viewBox="minX minY width height"   */}
        <svg viewBox='0 0 100 50' className='w-full h-full'>
          <defs>
            <linearGradient
            id='gaugeGradient'
            x1="0%" // start of the gradient
            y1="0%" // start of the gradient
            x2="100%" // end of the gradient
            y2="0%" // end of the gradient
            // left to right gradient
            >
              <stop offset="0%" 
              stopColor='#a78bfa' // start color: purple
              />
              <stop offset="100%" 
              stopColor='#fca5a5' // end color: red
              />

            </linearGradient>
            </defs>

            {/* Background arc */}
            <path 

// M:Move to 10,50
// A:Arc with rx=40, ry=40, x-axis-rotation=0, large-arc-flag=0, sweep-flag=1, to 90,50

            d='M10, 50 A40, 40 0 0, 1 90, 50'
            fill='none'
            stroke='#e5e7eb'
            strokeWidth="10"
            strokeLinecap='round'
            />
            {/* Foreground arc representing the score */}
            <path 
            ref={circleRef}
            d="M10,50 A40,40 0 0,1 90,50 "
            fill='none'
            stroke='url(#gaugeGradient)'
            strokeWidth={10}
            strokeLinecap='round'
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1-percentage)}
            />

           

        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center pt-2'>
          <div className='text-xl font-semibold pt-4'>{score}/100</div>
        </div>

        {/* <svg viewBox='0 0 100 100' className="w-full h-full">
          <circle 
          fill='none'
          stroke='#e5e7eb'
          strokeWidth={10}
          cx={50}
          cy={50}
          r={40}
          />
          <circle 
          fill='none'
          cx={50}
          cy={50}
          r={40}
          stroke='purple'
          strokeWidth={10}
          strokeDasharray={2*Math.PI *40}
          strokeDashoffset={(2*Math.PI *40)*(1-percentage)}
          strokeLinecap='round'
          transform='rotate(-90 50 50)'
          />
        </svg> */}

      </div>

    </div>)
}

export default ScoreGauge