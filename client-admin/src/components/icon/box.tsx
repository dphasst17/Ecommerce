import type { SVGProps } from 'react';

export function IconParkBox(props: SVGProps<SVGSVGElement>) {
    return (<svg className='w-[80px] h-[70px]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}>
        <g fill="none" strokeLinejoin="round" strokeWidth={4}>
            <rect width={36} height={30} x={6} y={12} fill="#2f88ff" stroke="#000" rx={2}></rect>
            <path stroke="#fff" strokeLinecap="round" d="M17.9497 24.0083L29.9497 24.0083"></path>
            <path stroke="#000" strokeLinecap="round" d="M6 13L13 5H35L42 13"></path>
        </g>
    </svg>);
}