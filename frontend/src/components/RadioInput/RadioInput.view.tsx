import "./RadioInput.css";

type RadioInputProps = {
  label: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  onSelect: (value: string) => void;
};

const RadioInput = (props: RadioInputProps) => {
  const { label, value, onSelect, checked = false, disabled = false } = props;

  // TODO: something is wrong with the input's logic
  return (
    <div className="radioInput" data-testid="radio-input-container">
      <label>
        <input
          data-testid="radio-input-control"
          type="radio"
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onSelect(e.target.value)}
        />
        {label}
      </label>
    </div>
  );
};

export default RadioInput;
