/**
 * Base value object class that all value objects should extend
 * Value objects are immutable and compared by their values, not identity
 */
export abstract class ValueObject {
  equals(vo?: ValueObject): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (this === vo) {
      return true;
    }

    return JSON.stringify(this) === JSON.stringify(vo);
  }
}
