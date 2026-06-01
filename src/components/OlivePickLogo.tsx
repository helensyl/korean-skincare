import Image from 'next/image'

export default function OlivePickLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/olive-pick.png"
        alt="olive on a pick"
        width={40}
        height={40}
        className="object-contain"
        style={{ height: '2rem', width: 'auto', transform: 'rotate(12deg)' }}
        unoptimized
      />
      <span
        className="font-body font-semibold italic uppercase leading-none tracking-tight"
        style={{ fontSize: '1.25rem', color: '#3d3d3d' }}
      >
        olive pick
      </span>
    </div>
  )
}
