import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useVehicleSearch } from '../model/use-vehicle-search';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { getVehicleTitle } from '@/entities/vehicle';
import { getVehicleTypeImage } from '@/shared/lib/vehicle-image-mapper';
import { generateMakeHue } from '@/shared/lib/color-generator';
import { cn } from '@/shared/lib/cn';
import styles from './SearchBar.module.css';

export function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { query, setQuery, results, isLoading } = useVehicleSearch();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    navigate(`/vehicles/${code}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className={cn(styles.container, className)}>
      <div className={styles.inputWrapper}>
        <Search className={styles.searchIcon} size={20} />
        <input
          id="global-search-input"
          type="text"
          className={styles.input}
          placeholder="Search EV Models, Specs, or Features..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        {isLoading && (
          <div className={styles.spinner}>
            <Spinner size="sm" />
          </div>
        )}
      </div>

      {isOpen && query.length > 0 && (
        <div className={styles.dropdown}>
          {results.length > 0 ? (
            results.map((vehicle) => (
              <button
                key={vehicle.unique_code}
                className={styles.resultItem}
                onClick={() => handleSelect(vehicle.unique_code)}
                style={
                  { '--vehicle-hue': generateMakeHue(vehicle.make.name) } as React.CSSProperties
                }
              >
                <img
                  src={getVehicleTypeImage(vehicle.vehicle_type)}
                  alt=""
                  className={styles.thumb}
                  loading="lazy"
                />
                <div className={styles.info}>
                  <span className={styles.name}>{getVehicleTitle(vehicle)}</span>
                </div>
              </button>
            ))
          ) : (
            <div className={styles.empty}>No vehicles found</div>
          )}
        </div>
      )}
    </div>
  );
}
