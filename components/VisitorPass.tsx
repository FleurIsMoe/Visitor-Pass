'use client'

import { useEffect, useState, useRef } from 'react'
import { Card } from "@/components/ui/card"
import { User, Calendar, MapPin } from 'lucide-react'

interface VisitorPassProps {
  visitorNumber: number;
}

export default function VisitorPass({ visitorNumber }: VisitorPassProps) {
  const [location, setLocation] = useState<string>('Locating...')
  const [currentDate, setCurrentDate] = useState<string>('')
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const colors = [
    '#ff6b6b',
    '#845ef7',
    '#ffd43b',
    '#69db7c',
    '#4dabf7',
    '#da77f2',
    '#ff8787',
    '#ff99cc',
    '#0099cc',
    '#66cc00',
    '#ffcc00',
    '#0077cc',
    '#ff3300',
    '#33ff00',
    '#cc00ff',
    '#ff0066',
    '#6600ff',
    '#00ffcc',
    '#ff6600',
    '#0099ff',
    '#ccff00',
    '#ff0099',
    '#00ccff',
    '#ff9900',
    '#009933',
    '#ffcc66',
    '#0066cc',
    '#ff00ff',
    '#3300ff',
    '#ff6666',
    '#0033ff',
    '#ff0033',
    '#00ff00',
    '#ff9900',
  ]
  const color = colors[(visitorNumber - 1) % colors.length]

  useEffect(() => {
    const fetchLocation = async () => {
      const savedLocation = localStorage.getItem('location');
      const savedDate = localStorage.getItem('locationDate');
      const now = new Date();

      if (savedLocation && savedDate) {
        const savedDateTime = new Date(savedDate);
        const timeDifference = now.getTime() - savedDateTime.getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        if (timeDifference < oneDay) {
          const locationData = JSON.parse(savedLocation);
          setLocation(`${locationData.city}, ${locationData.country_name}`);
          const dateFormat = locationData.country_code === 'US' ? 'en-US' : 'en-GB';
          setCurrentDate(now.toLocaleDateString(dateFormat, { year: 'numeric', month: 'numeric', day: 'numeric' }));
          return;
        }
      }

      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error(`Failed to fetch location, status: ${res.status}`);
        const data = await res.json();
        console.log('Location data:', data); // Log the data for debugging
        if (data.city && data.country_name) {
          setLocation(`${data.city}, ${data.country_name}`);
          localStorage.setItem('location', JSON.stringify(data));
          localStorage.setItem('locationDate', now.toISOString());

          const dateFormat = data.country_code === 'US' ? 'en-US' : 'en-GB';
          setCurrentDate(now.toLocaleDateString(dateFormat, { year: 'numeric', month: 'numeric', day: 'numeric' }));
        } else {
          throw new Error('Incomplete location data');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation('Location unavailable');
        // Default to day/month/year format if location is unavailable
        setCurrentDate(now.toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' }));
      }
    };

    fetchLocation();
  }, [visitorNumber]);

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const cardCenterX = rect.left + rect.width / 2
      const cardCenterY = rect.top + rect.height / 2

      const distanceX = e.clientX - cardCenterX
      const distanceY = e.clientY - cardCenterY

      const boundingBox = {
        left: rect.left - 500,
        right: rect.right + 500,
        top: rect.top - 500,
        bottom: rect.bottom + 500
      }

      if (
        e.clientX >= boundingBox.left &&
        e.clientX <= boundingBox.right &&
        e.clientY >= boundingBox.top &&
        e.clientY <= boundingBox.bottom
      ) {
        const maxRotation = 5
        const rotateY = -(distanceX / (rect.width / 2)) * maxRotation
        const rotateX = (distanceY / (rect.height / 2)) * maxRotation

        setRotation({ x: rotateX, y: rotateY })
      } else {
        setRotation({ x: 0, y: 0 })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const transformStyle = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`

  return (
    <div className="relative w-full max-w-[350px]">
      <Card 
        ref={cardRef} 
        className="w-full aspect-[1/1.6] relative overflow-hidden bg-black text-white border border-gray-800 shadow-xl rounded-3xl"
        style={{
          transform: transformStyle,
          transition: 'transform 0.2s ease-out'
        }}
      >
        
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <User className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <div className="text-xs text-gray-400">VISITOR</div>
                <div className="text-lg font-bold" style={{ color }}>#{visitorNumber.toString().padStart(7, '0')}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">ADMITS</div>
              <div className="text-lg font-bold">ONE</div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold tracking-tight">
                NEXT<span style={{ color }}>.</span>CONF
              </div>
              <div className="text-sm text-gray-400">Online Event</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12 bg-gray-900/50 shadow-2xl rounded-lg p-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Date</div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color }} />
                <span className="text-sm font-medium">{currentDate}</span>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Your Location</div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color }} />
                <span className="text-sm font-medium truncate">{location}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}