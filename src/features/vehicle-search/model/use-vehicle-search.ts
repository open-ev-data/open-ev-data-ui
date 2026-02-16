import { useState, useMemo } from 'react';
import { useVehicles } from '@/entities/vehicle';
import { getVehicleTitle } from '@/entities/vehicle';

export function useVehicleSearch() {
  const { data: vehicles, isLoading, error } = useVehicles();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || !vehicles) return [];

    const lowerQuery = query.toLowerCase();

    return vehicles
      .filter((vehicle) => {
        const title = getVehicleTitle(vehicle).toLowerCase();
        // Search by make, model, trim, year
        return title.includes(lowerQuery);
      })
      .slice(0, 10); // Limit to top 10 results
  }, [query, vehicles]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
}
