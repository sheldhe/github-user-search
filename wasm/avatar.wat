(module
  (memory (export "memory") 4)

  (func (export "tint")
    (param $ptr i32) (param $len i32)
    (param $addR i32) (param $addG i32) (param $addB i32)
    (local $i i32) (local $v i32) (local $addr i32)

    (local.set $i (i32.const 0))
    (block $break
      (loop $loop
        (br_if $break (i32.ge_u (local.get $i) (local.get $len)))

        ;; R
        (local.set $addr (i32.add (local.get $ptr) (local.get $i)))
        (local.set $v (i32.add (i32.load8_u (local.get $addr)) (local.get $addR)))
        (if (i32.gt_u (local.get $v) (i32.const 255)) (then (local.set $v (i32.const 255))))
        (i32.store8 (local.get $addr) (local.get $v))

        ;; G
        (local.set $addr (i32.add (local.get $ptr) (i32.add (local.get $i) (i32.const 1))))
        (local.set $v (i32.add (i32.load8_u (local.get $addr)) (local.get $addG)))
        (if (i32.gt_u (local.get $v) (i32.const 255)) (then (local.set $v (i32.const 255))))
        (i32.store8 (local.get $addr) (local.get $v))

        ;; B
        (local.set $addr (i32.add (local.get $ptr) (i32.add (local.get $i) (i32.const 2))))
        (local.set $v (i32.add (i32.load8_u (local.get $addr)) (local.get $addB)))
        (if (i32.gt_u (local.get $v) (i32.const 255)) (then (local.set $v (i32.const 255))))
        (i32.store8 (local.get $addr) (local.get $v))

        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $loop)
      )
    )
  )
)
