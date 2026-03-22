export { UsedByList }

import React from 'react'

type UsedByEntry = {
  website: `https://${string}`
  desc: string
  name: string
  order: number
}

const usedByData: UsedByEntry[] = [
  {
    website: 'https://name.com',
    name: 'Name.com',
    desc: 'Popular domain registrar',
    order: 0,
  },
  {
    website: 'https://contra.com',
    desc: 'Upwork alternative',
    name: 'Contra',
    order: 200,
  },
  {
    website: 'https://app.spline.design',
    desc: 'Advanced 3D design web app',
    name: 'Spline',
    order: -200,
  },
  {
    website: 'https://ecosia.org',
    desc: 'Google alternative',
    name: 'Ecosia',
    order: -50,
  },
  {
    website: 'https://bild.de',
    desc: "Germany's most read newspaper",
    name: 'Bild.de',
    order: -100,
  },
  {
    website: 'https://dia.es',
    desc: "Spain's supermarket with the most stores",
    name: 'Dia.es',
    order: 100,
  },
]

function UsedByList() {
  return (
    <ul>
      {usedByData
        .slice()
        .sort((entry1, entry2) => entry1.order - entry2.order)
        .map((entry) => (
          <li key={entry.website}>
            <a href={entry.website} target="_blank">
              {entry.name}
            </a>{' '}
            - {entry.desc}
          </li>
        ))}
    </ul>
  )
}
