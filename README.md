# TODO

- Remove duplicate socket logic: currently there are both socket.ts utilities and a custom hook creating its own io()—choose one pattern to avoid two connections.
- Add TypeScript event typing (define an enum or union of event names).
- Add a heartbeat / presence mechanism to prune stale users if a disconnect edge case occurs without proper leave.
- Consider server-side progress caching per room so late joiners can see current opponent progress (currently only new joins get user list, not their current progress)
