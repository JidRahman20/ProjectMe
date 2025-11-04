interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  lightColor: string;
}

export default function StatsCard({ title, value, icon, gradientFrom, gradientTo, lightColor }: StatsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${lightColor} text-sm font-medium`}>{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}
