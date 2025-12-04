import { Confederation } from 'src/enums/confederation';

export default function confederationValidator(confederation: string, value: number): boolean {
  if (confederation == Confederation.UEFA) {
    if (value == 1 || value == 2) return true;
  } else if (value == 0 || value == 1) return true;
  return false;
}
