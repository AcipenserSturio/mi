<script lang="ts">
  import { convert, revert } from "@/lib/polcyr.ts";

  let latin = "";
  let cyrillic = "";

  function onLatinInput(event: any) {
    // latin = event.target.value;
    cyrillic = convert(event.target.value);
  }

  function onCyrillicInput(event: any) {
    // cyrillic = event.target.value;
    latin = revert(event.target.value);
  }
</script>

<div>
  <h2>Łacinka</h2>
  <textarea
    bind:value={latin}
    on:input={onLatinInput}
    spellcheck="false"
    placeholder="Napisz coś tutaj!"
  ></textarea>
</div>
<div>
  <h2>Цириліца</h2>
  <textarea
    bind:value={cyrillic}
    on:input={onCyrillicInput}
    spellcheck="false"
    placeholder="Напіш цось тоутај!"
  ></textarea>
</div>

<style>
  div {
    margin: 10px 0px;
  }
  h2 {
    text-align: center;
    margin: 10px;
    font-weight: initial;
  }
  textarea {
    display: inline-block;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 110%;
    padding: 10px;
    height: 200px;
    width: 100%;
    resize: vertical;
  }

  @media (max-width: 600px) {
    div {
      flex-direction: column;
    }
  }
</style>
