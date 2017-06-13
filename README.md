# benchmarking mobx state tree / mutable / mobx 

This repo tracks the difference between mobx, mobx state trees and mutable, using basic use cases benchmarks.
Not every comparison is equal between the three due to the different approaches they take.

Anyone looking at these numbers should take into account that mobx state trees are still in an early stage, not yet aiming for performance.


| linked list         | MST#applySnapshot() | MST#create()   | mutable#setValueDeep() | mutable#constructor | mobx#observable.object() | mobx#observable.box() |
|---------------------|---------------------|----------------|------------------------|---------------------|--------------------------|-----------------------|
| empty list          | 68,582 ops/sec      | 14,396 ops/sec | 1,297,209 ops/sec      | 39,924 ops/sec      | 566,655 ops/sec          | 412,325 ops/sec       |
| short list          | 10,904 ops/sec      | 2,394 ops/sec  | 277,989 ops/sec        | 6,784 ops/sec       | 54,963 ops/sec           | 53,175 ops/sec        |
| Long list           | 1,855 ops/sec       | 437 ops/sec    | 108,806 ops/sec        | 2,120 ops/sec       | 18,829 ops/sec           | 17,547 ops/sec        |
| Very long list      | 244 ops/sec         | 65.58 ops/sec  | 37,809 ops/sec         | 531 ops/sec         | 6,188 ops/sec            | 6,195 ops/sec         |
| Extremely long list | 24.15 ops/sec       | 7.48 ops/sec   | 11,420 ops/sec         | 88.02 ops/sec       | 1,946 ops/sec            | 1,887 ops/sec         |

| array wrappers      | MST#applySnapshot() | MST#create()  | mutable#setValueDeep() | mutable#constructor | mobx#observable.object() | mobx#observable.box() |
|---------------------|---------------------|---------------|------------------------|---------------------|--------------------------|-----------------------|
| empty list          | 119,303 ops/sec     | 5,353 ops/sec | 396,763 ops/sec        | 19,606 ops/sec      | 161,534 ops/sec          | 139,285 ops/sec       |
| short list          | 21,523 ops/sec      | 4,491 ops/sec | 229,907 ops/sec        | 14,541 ops/sec      | 68,522 ops/sec           | 63,211 ops/sec        |
| Long list           | 10,153 ops/sec      | 3,421 ops/sec | 124,144 ops/sec        | 12,574 ops/sec      | 50,828 ops/sec           | 47,265 ops/sec        |
| Very long list      | 3,938 ops/sec       | 1,968 ops/sec | 51,889 ops/sec         | 8,748 ops/sec       | 28,160 ops/sec           | 26,760 ops/sec        |
| Extremely long list | 1,214 ops/sec       | 928 ops/sec   | 17,777 ops/sec         | 4,376 ops/sec       | 11,377 ops/sec           | 11,200 ops/sec        |

| a fat, flat object    | MST#applySnapshot() | MST#create() | mutable#setValueDeep() | mutable#constructor | mobx#observable.object() | mobx#observable.box() |
|-----------------------|---------------------|--------------|------------------------|---------------------|--------------------------|-----------------------|
| empty obj             | 1,386 ops/sec       | 736 ops/sec  | 68,348 ops/sec         | 5,161 ops/sec       | 515,333 ops/sec          | 397,339 ops/sec       |
| short obj             | 1,414 ops/sec       | 752 ops/sec  | 71,517 ops/sec         | 4,838 ops/sec       | 141,357 ops/sec          | 127,019 ops/sec       |
| Long obj              | 1,405 ops/sec       | 760 ops/sec  | 60,833 ops/sec         | 4,887 ops/sec       | 48,363 ops/sec           | 48,604 ops/sec        |
| Very fat obj          | 1,406 ops/sec       | 741 ops/sec  | 98,050 ops/sec         | 4,891 ops/sec       | 14,857 ops/sec           | 14,856 ops/sec        |
| Fat like it should be | 1,438 ops/sec       | 766 ops/sec  | 157,738 ops/sec        | 5,316 ops/sec       | 8,820 ops/sec            | 8,989 ops/sec         |
| Extremely fat obj     | 1,429 ops/sec       | 757 ops/sec  | 159,255 ops/sec        | 5,181 ops/sec       | 3,753 ops/sec            | 3,756 ops/sec         |

| map wrappers       | MST#applySnapshot() | MST#create()  | mutable#setValueDeep() | mutable#constructor | mobx#observable.map() and observable.shallow() |
|--------------------|---------------------|---------------|------------------------|---------------------|------------------------------------------------|
| empty map          | 137,033 ops/sec     | 5,625 ops/sec | 243,395 ops/sec        | 19,306 ops/sec      | 405,923 ops/sec                                |
| short map          | 29,700 ops/sec      | 3,540 ops/sec | 105,325 ops/sec        | 9,154 ops/sec       | 35,010 ops/sec                                 |
| Long map           | 13,974 ops/sec      | 2,440 ops/sec | 60,967 ops/sec         | 6,074 ops/sec       | 13,181 ops/sec                                 |
| Very long map      | 5,705 ops/sec       | 1,287 ops/sec | 27,253 ops/sec         | 3,310 ops/sec       | 5,055 ops/sec                                  |
| Extremely long map | 1,922 ops/sec       | 475 ops/sec   | 10,171 ops/sec         | 1,415 ops/sec       | 1,821 ops/sec                                  |

| react state solutions  | empty pure component | vanilla component | mst component  | mutable component | mobx component |
|------|----------------------|-------------------|----------------|-------------------|----------------|
| 0    | 41,747 ops/sec       | 41,145 ops/sec    | 39,562 ops/sec | 38,910 ops/sec    | 40,252 ops/sec |
| 3    | 3,705 ops/sec        | 3,975 ops/sec     | 1,189 ops/sec  | 1,791 ops/sec     | 2,375 ops/sec  |
| 10   | 1,428 ops/sec        | 1,468 ops/sec     | 400 ops/sec    | 601 ops/sec       | 850 ops/sec    |
| 31   | 505 ops/sec          | 481 ops/sec       | 128 ops/sec    | 202 ops/sec       | 275 ops/sec    |
| 100  | 148 ops/sec          | 147 ops/sec       | 40.67 ops/sec  | 63.57 ops/sec     | 79.84 ops/sec  |
| 316  | 46.77 ops/sec        | 44.88 ops/sec     | 13.16 ops/sec  | 21.58 ops/sec     | 28.22 ops/sec  |
| 1000 | 14.00 ops/sec        | 13.30 ops/sec     | 4.01 ops/sec   | 6.64 ops/sec      | 8.27 ops/sec   |
