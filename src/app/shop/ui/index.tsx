import { styled } from "styled-components";

export { IconEdit, IconSave, IconCancel, IconButton } from "./icons";

export const ShopRoot = styled.div`
  margin-top: 15px;
  border: 1px solid white;
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;

  h1 {
    display: flex;
    justify-content: center;
    justify-items: center;
    width: 100%;
  }
`;

export const CreateForm = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  padding: 12px;
  border-radius: 8px;
  input {
    padding: 8px;
    margin: 5px;
    border-radius: 6px;
  }
`;

export const Input = styled.input`
  background: grey;
  padding: 8px;
  border-radius: 6px;
`;

export const Button = styled.button`
  background: grey;
  padding: 6px 10px;
  margin: 5px;
  border-radius: 6px;
`;

export const Fields = styled.div`
  display: flex;
  flex: 1;
  justify-self: center;
  gap: 8px;
  padding: 8px 0;
`;

export const NavBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
`;

export const NavToggle = styled.button<{ $active?: boolean }>`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: ${(p) => (p.$active ? "#ffffff" : "transparent")};
  color: ${(p) => (p.$active ? "#111827" : "#e5e7eb")};
  cursor: pointer;
  &:hover {
    background: ${(p) => (p.$active ? "#ffffff" : "rgba(255,255,255,0.06)")};
  }
`;

export const CategoryPanel = styled.div`
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  border-radius: 8px;
`;

export const SearchInput = styled.input`
  padding: 6px;
  margin: 6px 0;
  width: 100%;
  box-sizing: border-box;
`;

export const Select = styled.select`
  padding: 6px;
  margin: 6px 0;
`;

export const TreeNode = styled.div`
  padding: 6px 12px;
`;

export const CategoryControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  > input,
  > div {
    min-width: 200px;
  }
`;

export const CustomSelectRoot = styled.div`
  position: relative;
  width: 100%;
`;

export const CustomSelectTrigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0b0b0b;
  color: #e5e7eb;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
`;

export const CustomSelectList = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #070707;
  border: 1px solid rgba(255, 255, 255, 0.04);
  max-height: 220px;
  overflow: auto;
  border-radius: 6px;
  z-index: 30;
`;

export const CustomSelectItem = styled.div`
  padding: 8px 10px;
  color: #e5e7eb;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const OptionRow = styled(CustomSelectItem)<{ $level?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: ${(p) => (p.$level ?? 0) * 12}px;
`;

export const ExpandButton = styled.button<{ $isOpen?: boolean }>`
  background: transparent;
  border: none;
  color: #e5e7eb;
  cursor: ${(p) => (p.$isOpen ? "zoom-out" : "zoom-in")};
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin-left: 8px;
  border-radius: 6px;
`;

export const TreeWrap = styled.div`
  margin-top: 8px;
`;

export const InputWrap = styled.div`
  flex: 1;
  min-width: 220px;
`;

export const SelectWrap = styled.div`
  width: 240px;
`;

export const RowHeader = styled.div`
  display: flex;
  gap: 8px;
  padding: 6px 8px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
  > div:first-child {
    flex: 3;
  }
  > div:nth-child(2) {
    flex: 1;
    text-align: right;
  }
  > div:nth-child(3) {
    flex: 2;
    padding-left: 12px;
    text-align: left;
  }
`;

export const Card = styled.div<{ $odd?: boolean }>`
  background: ${(p) => (p.$odd ? "#141414" : "#0b0b0b")};
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: row;
  padding: 6px 8px;
  margin-bottom: 6px;
  border-radius: 6px;
  > div:first-child {
    flex: 3;
  }
  > div:nth-child(2) {
    flex: 1;
    text-align: right;
  }
  > div:nth-child(3) {
    flex: 2;
    text-align: left;
    padding-left: 12px;
  }
  color: #e5e7eb;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;
