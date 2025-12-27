import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  iconColor?: string;
  iconBgColor?: string;
}

const ActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  to,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10'
}: ActionCardProps) => {
  return (
    <Link to={to}>
      <Card variant="action" className="h-full group">
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
          <div className={`w-16 h-16 rounded-2xl ${iconBgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ActionCard;
