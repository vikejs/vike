export type { IsNotEmpty }
export type { XOR4 }
export type { Combine }

type IsNotEmpty<T> = Not<IsEmpty<T>>
// Playground: https://www.typescriptlang.org/play?ssl=2&ssc=1&pln=3&pc=1#code/C4TwDgpgBAkgzgUQLZlAHgCoD4oF4oDWEIA9gGZQZQQAewEAdgCZxQMQBuEATlAPxRg3AK7QAXFDIBDADZwIAbgCwAKFUB6dVAQ0pKGRFUBLBvW7SAxtGSoQUAN4BfY6Z6XoAORINkwMHftVKCgwbhIwCTghEwBzZRVnFVBIKCNEFFAARjxYdNs0G1AcKE1BEUMk8Gg0wpAAJhz4WrQvHyQ-EBxS6TkIIA
type IsEmpty<T> = keyof T extends never ? true : false

// Like union but on a prop level
//  - Playground: https://www.typescriptlang.org/play?#code/C4TwDgpgBAwg9gWwEYEsB2EA8AVAjAGimwCYA+KAXigG8BYAKCigG0BpKdKAawhDgDMiuKAB9uvAUWIBdAPwAuKAAp2EAB7AIaACYBncX0F4osoW2lRFGAG4QATgEpRy1Rq16DkkiannLUG3sHBgBfAG4GBlBIKABVNBQ4NGw4AEk0TTtdCABjYES0TFjyKiVYqHVNHX0AQzQQHyUuRVinCnJrOBRtf0DHCrdq5WaONH57KFS2jq6e01TeiFs7CPoo8GhsAFcwABsIFPTM7LyCnAGqjzqQZmkSuISkw4z7E-yknGY0LeR7O9X1jF4Mh0BAAEq5LZZFC2c6Vdz6CE5OB2bSYXTAOzoADmhGupFu922ewOaReWVy70KDCYdEYTBY7E4PEMRGkimBqAwn1Y0kI1BCpFWTBCDCFkXoAHpJVAAKJqGoIElQLa6GrYiDyQHQACydUoNBpAUVmqgGKxaGxwqg6tN31+K1CAPo0WgABE4NiDXSmGgTYpzTjrUg7BAINoA5ig06Ja7YDU7N6jQgajxIxarcm4NoILt09H6OFYxtYAbOaCkVDdDCsMw9WhCB7cfG7HdizEAArCKgwZgAcj9CAgfek2qgHeIZf7KZ4I7HHYAzFO+7a52t6Mi0BioMiQRgI6WqD7jUPFAAiABScAAFmgz-gjbbFAuAAwP+khsMHs8AGRqIZqbQUXvZNU1NM8Uj4YAahA+kEGzXNzxgRU7BAWCi3oIA
type Combine<T1, T2> = {
  [K in keyof T1 | keyof T2]?: (K extends keyof T1 ? T1[K] : never) | (K extends keyof T2 ? T2[K] : never)
}

// Unit test playground: https://www.typescriptlang.org/play?#code/C4TwDgpgBAGg8gJQCwB4AqBGKEAewIB2AJgM5QBGA9pQDYQCGBANFGgEzZ6GkXV2Ms0AZk75iZKrQbNWSUdwl9pAPigBeKAAoAsACgorLLjE9gAJwCuEPQYMB+Vh2MKo5qzdv2oAM3o0S1vqeUABcrCLO4q6WgcG2Dr7+sXGhUABylMDoSMoeBmHs8lFuyZ4OwkWmMXnBCX4BNZ5hGVloOY2pFZFV7kFxDi3ZuX3BBUh6AJR6oJDpmeiVilKMqhpoi9FWUHVJqSV60+DQaBAkwAAMBhrwyCiJASz3EI-1zz6vygDcBgD0P1AAZQAFpQLDQiBRoE9DrMTmcsOpYIhUE8Xkk0Q9NtAvr9-sDQeDIViYcdTsAOIibijXhi3iUoLScVA-oCQWCIeRoPtdDNSWcRJTkXcae90ViGeKmSz8eyidCeUdWGS5ILbqjxbTGd9mXi2YTOcSFbCyQBWK5ItUi+mayXa6V6jlQ14kpVnABs5qpwrF1o1ooCUt1BMd-sCvNdwAA7J6herffGYlBA6zg3LnUa+cAABwx26+9UFj52oOyg3c8Nw4AATlzqHzIrjieTMv1TqSLsrGEu1yF9Z9ia1uJTpbbDQzEYwWB7eYHoZYCa2zYdafb487HGnddnfcxTyXqYN8orZIwIk3KAX0Bt9P3I9DHZPcnPl4lO4gt9b97XJ7Nz+3-62ecm2LYdPyeIA
// prettier-ignore
type XOR4<T1 extends boolean, T2 extends boolean, T3 extends boolean, T4 extends boolean> = (
  T1 extends true
    ? T2 extends true
      ? false
      : T3 extends true
        ? false
        : Not<T4>
    : T2 extends true
      ? T3 extends true
        ? false
        : Not<T4>
      : T3 extends true
        ? Not<T4>
        : T4
)
type Not<T extends boolean> = T extends true ? false : true
