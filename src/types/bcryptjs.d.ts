declare module "bcryptjs" {
  /**
   * Synchronously generates a hash for the given string.
   */
  export function hashSync(s: string, salt?: number | string): string;

  /**
   * Asynchronously generates a hash for the given string.
   */
  export function hash(
    s: string,
    salt: number | string,
    callback?: (err: Error | null, hash: string) => void
  ): Promise<string>;

  /**
   * Synchronously tests a string against a hash.
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Asynchronously compares the given data against the given hash.
   */
  export function compare(
    s: string,
    hash: string,
    callback?: (err: Error | null, success: boolean) => void
  ): Promise<boolean>;

  /**
   * Synchronously generates a salt.
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Asynchronously generates a salt.
   */
  export function genSalt(
    rounds?: number,
    callback?: (err: Error | null, salt: string) => void
  ): Promise<string>;

  /**
   * Gets the number of rounds used to encrypt the specified hash.
   */
  export function getRounds(hash: string): number;

  /**
   * Gets the salt portion from a hash.
   */
  export function getSalt(hash: string): string;
}
