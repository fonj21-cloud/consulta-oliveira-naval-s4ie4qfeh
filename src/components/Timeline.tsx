import { Calendar, FileText, Gavel, CheckCircle2 } from 'lucide-react'
import { ProcessEvent } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface TimelineProps {
  events: ProcessEvent[]
}

export function Timeline({ events }: TimelineProps) {
  const getIcon = (type: ProcessEvent['type']) => {
    switch (type) {
      case 'audiencia':
        return <Calendar className="w-4 h-4 text-blue-600" />
      case 'documento':
        return <FileText className="w-4 h-4 text-emerald-600" />
      case 'conclusao':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'movimentacao':
      default:
        return <Gavel className="w-4 h-4 text-secondary" />
    }
  }

  const getIconBg = (type: ProcessEvent['type']) => {
    switch (type) {
      case 'audiencia':
        return 'bg-blue-100 border-blue-200'
      case 'documento':
        return 'bg-emerald-100 border-emerald-200'
      case 'conclusao':
        return 'bg-green-100 border-green-200'
      case 'movimentacao':
      default:
        return 'bg-secondary/20 border-secondary/30'
    }
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {events.map((event, index) => (
        <div
          key={event.id}
          className={cn(
            'relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active',
            'animate-slide-up',
          )}
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                getIconBg(event.type),
              )}
            >
              {getIcon(event.type)}
            </div>
          </div>

          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:border-secondary/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
              <h3 className="font-serif font-semibold text-lg text-primary">{event.title}</h3>
              <time className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md mt-2 sm:mt-0 w-fit">
                {event.date}
              </time>
            </div>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
