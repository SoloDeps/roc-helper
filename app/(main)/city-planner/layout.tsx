// app/city-planner/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'City Planner — RoC Helper',
  description: 'Plan and optimize your Rise of Cultures city',
};

export default function CityPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Plein écran, pas de scroll — le canvas prend toute la place
    <div className="flex flex-col h-screen overflow-hidden">
      {children}
    </div>
  );
}
