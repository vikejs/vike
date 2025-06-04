export type { IsNotEmpty }
export type { XOR5 }
export type { Combine }

type IsNotEmpty<T> = Not<IsEmpty<T>>
// Playground: https://www.typescriptlang.org/play?ssl=2&ssc=1&pln=3&pc=1#code/C4TwDgpgBAkgzgUQLZlAHgCoD4oF4oDWEIA9gGZQZQQAewEAdgCZxQMQBuEATlAPxRg3AK7QAXFDIBDADZwIAbgCwAKFUB6dVAQ0pKGRFUBLBvW7SAxtGSoQUAN4BfY6Z6XoAORINkwMHftVKCgwbhIwCTghEwBzZRVnFVBIKCNEFFAARjxYdNs0G1AcKE1BEUMk8Gg0wpAAJhz4WrQvHyQ-EBxS6TkIIA
type IsEmpty<T> = keyof T extends never ? true : false

// Like union but on a prop level
//  - Playground: https://www.typescriptlang.org/play?#code/C4TwDgpgBAwg9gWwEYEsB2EA8AVAjAGimwCYA+KAXigG8BYAKCigG0BpKdKAawhDgDMiuKAB9uvAUWIBdAPwAuKAAp2EAB7AIaACYBncX0F4osoW2lRFGAG4QATgEpRy1Rq16DkkiannLUG3sHBgBfAG4GBlBIKABVNBQ4NGw4AEk0TTtdCABjYES0TFjyKiVYqHVNHX0AQzQQHyUuRVinCnJrOBRtf0DHCrdq5WaONH57KFS2jq6e01TeiFs7CPoo8GhsAFcwABsIFPTM7LyCnAGqjzqQZmkSuISkw4z7E-yknGY0LeR7O9X1jF4Mh0BAAEq5LZZFC2c6Vdz6CE5OB2bSYXTAOzoADmhGupFu922ewOaReWVy70KDCYdEYTBY7E4PEMRGkimBqAwn1Y0kI1BCpFWTBCDCFkXoAHpJVAAKJqGoIElQLa6GrYiDyQHQACydUoNBpAUVmqgGKxaGxwqg6tN31+K1CAPo0WgABE4NiDXSmGgTYpzTjrUg7BAINoA5ig06Ja7YDU7N6jQgajxIxarcm4NoILt09H6OFYxtYAbOaCkVDdDCsMw9WhCB7cfG7HdizEAArCKgwZgAcj9CAgfek2qgHeIZf7KZ4I7HHYAzFO+7a52t6Mi0BioMiQRgI6WqD7jUPFAAiABScAAFmgz-gjbbFAuAAwP+khsMHs8AGRqIZqbQUXvZNU1NM8Uj4YAahA+kEGzXNzxgRU7BAWCi3oIA
type Combine<T1, T2> = {
  [K in keyof T1 | keyof T2]?: (K extends keyof T1 ? T1[K] : never) | (K extends keyof T2 ? T2[K] : never)
}

// Unit test playground: https://www.typescriptlang.org/play?#code/C4TwDgpgBAGg8gJQKwB4AqBGKEAewIB2AJgM5QBGA9pQDYQCGBANFGgEzZ6GkXV2Ms0AZk75iZKrQbNWAFlHcJfaYKQLxvKYwB8UALxQAFAFgAUFFZZcYnsABOAVwhmLFgPysO1xVHtOXru5QAGb0NCTO5oFQAFysIt4afpHRrh6h4SmpsXLqto5Z2VDpYREBRXEAcpTA6Eja5TnseWTJjUHCLb4F7WkhpYXRcWjyifn+UUUlmb2BVTV1DZOuwwlcST3LgR4jXW1b0dNlB3NQ1bVo9bNNo+vjg6ke54vXFsNIZgCUZqCQZwtoLqSfgEXQGQFjVoFYr9TI5fY-cDQNAQEjAAAM+lgiFQGQiLDxEAJA2JmVJEW0AG4LAB6GlQADKAAtKA4aEQKNBCYi-ii0VgDPBkChCeSibD8RLxckqbT6czWezOd0Jr9kajgBxBTiRSSpWKWMkxbKoHTGSy2RzyNB9mrWBqRNrhaL9a6jSqICazQrLcruaY7XzgPInbi9S73S7CV75RaldaPTz1Wi1KHdWS3QUDR6Y+bFVauQMk-a0QA2LFCsMZiNZj3G6mm2P5v1FgNIkvAADsFZ1Ub17oHBVzPvjhZmbd5GoAHD3nf3a33qwNh3GC4mJ8ngABOWdVyWR8Pzpwr5sJ-2BjUYTFpmtObMHzIn31n1sX-kC7FzjMP-e1mUN71Vxbcc32ADAtU-PdpT-BdD0fACm2fMdjlAjBHUg9NfzvOtM2PBC8yQqViyDDAQww29oOwn9PXwkc13PdsSNTcij0otjDSHWigJfEDGMvcs02o7NFwpLjTxtTZUO7QTYKXOSsJouUCNHIiNw7DAZxk7CRPYqUnxUhjJ35HctPFHSOKozilLo4CUL4tE2GvDChJwnT9Po197M1D9KxQFz-KsxtlI83ijM1CDfICyztOXMTCMMzc2HQyLZIUiy2Pc2zIlAtgyJS6KzLgyVozigzPLCthmPy3TzJzUqQrsiqBOcmCYu-VLFKCmyeMaxLpJagr71azrAPE1Scs0gbdJckrrO45Dsq8tgTKm9K1twkbELK0LNyEJzqvWwc2tEuaxoSjshB8nUjum4bMp6iAgA
// prettier-ignore
// biome-ignore format:
type XOR5<T1 extends boolean, T2 extends boolean, T3 extends boolean, T4 extends boolean, T5 extends boolean> = (
  T1 extends true
    ? T2 extends true
      ? false
      : T3 extends true
        ? false
        : T4 extends true
          ? false
          : Not<T5>
    : T2 extends true
      ? T3 extends true
        ? false
        : T4 extends true
          ? false
          : Not<T5>
      : T3 extends true
        ? T4 extends true
          ? false
          : Not<T5>
        : T4 extends true
          ? Not<T5>
          : T5
)
type Not<T extends boolean> = T extends true ? false : true
