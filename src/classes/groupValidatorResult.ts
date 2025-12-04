import confederationValidator from './confederationValidator';

export default class GroupValidatorResult {
  group: string = '';
  results: Map<string, number>;

  constructor(name: string, results: Map<string, number>) {
    this.group = name;
    this.results = results;
  }

  isValid(): boolean {
    for (const x of this.results.entries()) {
      if (!confederationValidator(x[0], x[1])) return false;
    }

    return true;
  }
}
