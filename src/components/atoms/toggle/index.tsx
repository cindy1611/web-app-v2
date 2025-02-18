import css from './toggle.module.scss';
import { ToggleProps } from './toggle.types';

export const Toggle: React.FC<ToggleProps> = ({ checked, name, onChange }) => {
  return (
    <div className={css.container}>
      <input
        type="checkbox"
        className={css.input}
        checked={checked}
        name={name}
        onChange={(e) => onChange(e.currentTarget.checked, name)}
      />
      <span className={css.toggle}></span>
    </div>
  );
};
