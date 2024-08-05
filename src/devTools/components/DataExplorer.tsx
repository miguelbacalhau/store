import { CSSProperties, MouseEvent as ReactMouseEvent, useState } from 'react';

import { isReference } from '../../factories/reference';
import { error200 } from '../cssTokens/colors';
import { space100, space200 } from '../cssTokens/spacings';
import { ReferenceLink } from './ReferenceLink';

type DataExplorerProps = { data: unknown };
type DataExplorerHelperProps = { prevKey: string; data: object };

export function DataExplorer({ data }: DataExplorerProps) {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  function DataExplorerHelper({ prevKey, data }: DataExplorerHelperProps) {
    function handleClick(
      event: ReactMouseEvent<HTMLDivElement, MouseEvent>,
      key: string,
    ) {
      event.stopPropagation();

      setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
    }

    const entries = Object.entries(data);

    return entries.map(([key, value]) => {
      const nestedKey = `${prevKey}.${key}`;

      const isExpanded = expandedKeys[nestedKey];
      const isValueObject = isObject(value);
      const isValueReference = isReference(value);

      if (!isValueObject) {
        return (
          <div key={nestedKey} style={entryStyle}>
            <div>{key}:</div>
            <div style={valueStyle}>{stringifyData(value)}</div>
          </div>
        );
      }

      if (isValueReference) {
        return (
          <div key={nestedKey} style={entryStyle}>
            <div>{key}:</div>
            <ReferenceLink reference={value} />
          </div>
        );
      }

      return (
        <div key={nestedKey} onClick={(event) => handleClick(event, nestedKey)}>
          <div style={entryStyle}>
            <div style={expandStyle}>{isExpanded ? '▼' : '▶'}</div>
            <div>{key}</div>
            <div style={itemCountStyle}>
              {Object.entries(value).length} items
            </div>
          </div>
          {isExpanded && (
            <div style={objectStyle}>
              <DataExplorerHelper prevKey={nestedKey} data={value as object} />
            </div>
          )}
        </div>
      );
    });
  }

  if (!isObject) {
    return <div style={dataExplorerStyle}>{stringifyData(data)}</div>;
  }

  return (
    <div style={dataExplorerStyle}>
      <DataExplorerHelper prevKey="" data={data as object} />
    </div>
  );
}

function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

function stringifyData(value: unknown) {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string' || value instanceof String) {
    return `"${value}"`;
  }

  return `${value}`;
}

const dataExplorerStyle: CSSProperties = {
  fontFamily: 'Source Code Pro, sans-serif',
  // fontSize: '10px',
};

const entryStyle: CSSProperties = {
  display: 'flex',
  gap: space100,
};

const valueStyle: CSSProperties = {
  color: error200,
};

const objectStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: space200,
};

const expandStyle: CSSProperties = {
  fontSize: '10px',
  display: 'flex',
  alignItems: 'center',
};

const itemCountStyle: CSSProperties = {
  fontSize: '10px',
  display: 'flex',
  alignItems: 'center',
};
