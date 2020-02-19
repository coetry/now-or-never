<script>
  import UsageExample from "./UsageExample.svelte";
  import Footer from "./Footer.svelte";
  let isNow;
  let nowid = "x-now-id";
  let headers = undefined;
  let path = document.location.pathname.slice(1) || "https://zeit.co";
  let _path = path;
  let requestPromise = pingServer(_path);

  async function pingServer(v) {
    _path = v;
    try {
      const x = await fetch(`/api/is-now?path=${_path}`).then(res =>
        res.json()
      );
      headers = x;
      console.log({ headers });
      isNow = !!(headers && headers[nowid]);
      followonPromise = pingApi();
    } catch (err) {
      console.error("error pinging the is-now function, please check");
      console.error({ err });
    }
  }
  const handleKeyUp = v => {
    requestPromise = pingServer(v);
  };
  handleKeyUp(path);
</script>

<style>
  :global(h1, a, a:visited) {
    color: lightcyan;
  }
  .bigtext {
    font-weight: bold;
    font-size: 10rem;
  }
  .domaininput {
    border: none;
    background: transparent;
    text-align: center;
    width: 100%;
    font-size: calc(30px + (100 - 30) * ((100vw - 200px) / (1600 - 200)));
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    /* font-size: 5vw; */
    font-weight: bold;
    color: orangered;
    line-height: calc(1.3em + (1.5 - 1.2) * ((100vw - 300px) / (1600 - 300)));
  }
  .success {
    color: green;
  }
  .fail {
    color: red;
  }
  .serverheader {
    font-weight: bold;
    color: lightcyan;
  }

  pre {
    background-color: lightgray;
    border-radius: 10px;
    padding: 10px;
    color: black;
    overflow-x: scroll;
    overflow-y: hidden;
    max-width: 80vw;
  }
  main {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr 100px 2fr 100px;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    height: 90vh;
  }
  main .header {
    text-align: center;
    grid-area: 1 / 1 / 2 / 4;
  }
  main .middle {
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    padding: 1rem;
    grid-area: 2 / 1 / 3 / 4;
    background-color: hsla(300, 100%, 50%, 0.1);
  }
  main .status {
    text-align: center;
    grid-area: 3 / 1 / 4 / 4;
  }
</style>

<main>
  <div class="header">
    <input
      type="text"
      class="domaininput"
      bind:value={path}
      on:input={({ target: { value } }) => handleKeyUp(value)} />
  </div>
  <div class="middle">
    <h1>Is This ZEIT Now?</h1>
  </div>

  <div class="status">
    {#await requestPromise}
      <p>
        <span class={'bigtext'}>checking...</span>
      </p>
    {:then}
      <p>
        <span class={'bigtext ' + (isNow ? ' success' : 'fail')}>
          {headers[nowid] ? 'Yup 🎉' : 'Not Yet!'}
        </span>
      </p>
      <p>
        Server Header:
        <span class="serverheader">{headers['server']}</span>
      </p>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
    <UsageExample />
  </div>
  <Footer {headers} />
</main>
