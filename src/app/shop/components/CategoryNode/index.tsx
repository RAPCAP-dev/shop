"use client";

import React from "react";
import { styled } from "styled-components";

import { TreeNode } from "@ui";
import { Category } from "@models";

const Row = styled.div<{ $level: number; $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: ${(p) => p.$level * 12}px;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
`;

const ToggleBox = styled.div`
  width: 18px;
  text-align: center;
`;

const Container = styled.div``;

type Props = {
  node: Category;
  childrenMap: Map<string | null, Category[]>;
  level?: number;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};

export const CategoryNode: React.FC<Props> = ({
  node,
  childrenMap,
  level = 0,
  expanded,
  setExpanded,
}) => {
  const children = childrenMap.get(node.id) || [];
  const isOpen = !!expanded[node.id];

  const toggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpanded((s) => ({ ...s, [node.id]: !s[node.id] }));
  };

  return (
    <Container key={node.id}>
      <Row
        $level={level}
        $clickable={children.length > 0}
        onClick={children.length ? toggle : undefined}
      >
        {children.length ? (
          <ToggleBox onClick={toggle}>{isOpen ? "▾" : "▸"}</ToggleBox>
        ) : (
          <ToggleBox />
        )}
        <TreeNode>{node.name}</TreeNode>
      </Row>
      {isOpen &&
        children.map((c) => (
          <CategoryNode
            key={c.id}
            node={c}
            childrenMap={childrenMap}
            level={(level || 0) + 1}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        ))}
    </Container>
  );
};

export default React.memo(CategoryNode);
