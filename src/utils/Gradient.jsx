import {
  LAB_GRADIENTS,
  GRADIENT_ENUMS,
  FALLBACK_GRADIENT,
} from '../constants/gradients';

export default function Gradients({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-4">
      {GRADIENT_ENUMS.map((enumKey) => {
        const cls = LAB_GRADIENTS[enumKey] || FALLBACK_GRADIENT;
        const active = value === enumKey;
        return (
          <button
            key={enumKey}
            type="button"
            onClick={() => onChange(enumKey)}
            className={`h-12 flex-1 min-w-[170px] max-w-[220px] rounded-md bg-gradient-to-r ${cls} ring-2 transition
              ${
                active
                  ? 'ring-primary scale-[1.02]'
                  : 'ring-transparent hover:ring-primary/40'
              }`}
            title={enumKey}
          />
        );
      })}
    </div>
  );
}