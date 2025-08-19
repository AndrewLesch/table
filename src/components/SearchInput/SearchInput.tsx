import React from 'react';
import { Input } from 'antd';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => (
  <Input
    placeholder="Search..."
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{ marginBottom: 16 }}
  />
);

export default SearchInput;
