export { Layout }

import React, { useState } from 'react'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1>Starship 🚀</h1>
      <p>
        <b>
          This page uses the layout <code>/pages/+Layout.tsx</code> with a nested layout{' '}
          <code>/pages/starship/+Layout.tsx</code>.
        </b>
      </p>
      <p>
        <b>
          State is preserved upon navigating within the nested layout. Click on the counter then on the links below:
          observe how the counter state is preserved.
        </b>{' '}
        <Counter />
      </p>
      <br />
      <div>
        <Link href="/starship">Overview</Link> <Link href="/starship/reviews">Reviews</Link>{' '}
        <Link href="/starship/spec">Tech Spec</Link>
      </div>
      <div style={{ marginTop: 20, border: '1px solid black', padding: '10px 40px' }}>{children}</div>
      <br />
      <p>
        <b>The scroll position is preserved when navigating the nested layout.</b>
      </p>
      <DummyText />
    </>
  )
}

function Link(props: any) {
  // We set `keep-scroll-position` to tell Vike to preserve the current scroll position
  return <a keep-scroll-position="" style={{ marginRight: 10, ...props.style }} {...props} />
}

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      Counter {count}
    </button>
  )
}

function DummyText() {
  return (
    <>
      <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum
        sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies
        nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
        aliquet nec, vulputate eget, arcu.
      </p>
      <p>
        In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.
        Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo
        ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat
        a, tellus.
      </p>
      <p>
        Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel
        augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget
        condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit
        vel, luctus pulvinar, hendrerit id, lorem.
      </p>
      <p>
        Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante.
        Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales
        sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a
        libero. Fusce vulputate eleifend sapien.
      </p>
      <p>
        Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras
        ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
        posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu.
      </p>
      <p>
        Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer
        ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum
        rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl
        sagittis vestibulum.
      </p>
      <p>
        Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit
        risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque.
        Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non,
        euismod vitae, posuere imperdiet, leo.
      </p>
      <p>
        Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu.
        Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
        cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis
        orci. Phasellus consectetuer vestibulum elit.
      </p>
      <p>
        Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In
        turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit
        nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non,
        turpis. Nullam sagittis.
      </p>
      <p>
        Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis
        nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut
        varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque.
      </p>
    </>
  )
}
