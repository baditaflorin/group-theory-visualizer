(module
  (memory (export "memory") 1)

  (func $cell (param $ptr i32) (param $order i32) (param $a i32) (param $b i32) (result i32)
    local.get $ptr
    local.get $a
    local.get $order
    i32.mul
    i32.add
    local.get $b
    i32.add
    i32.load8_u
  )

  (func (export "product") (param $ptr i32) (param $order i32) (param $a i32) (param $b i32) (result i32)
    local.get $ptr
    local.get $order
    local.get $a
    local.get $b
    call $cell
  )

  (func (export "inverse") (param $ptr i32) (param $order i32) (param $identity i32) (param $a i32) (result i32)
    (local $i i32)
    (local.set $i (i32.const 0))
    (block $exit
      (loop $scan
        local.get $i
        local.get $order
        i32.ge_u
        br_if $exit

        local.get $ptr
        local.get $order
        local.get $a
        local.get $i
        call $cell
        local.get $identity
        i32.eq
        if
          local.get $ptr
          local.get $order
          local.get $i
          local.get $a
          call $cell
          local.get $identity
          i32.eq
          if
            local.get $i
            return
          end
        end

        local.get $i
        i32.const 1
        i32.add
        local.set $i
        br $scan
      )
    )
    i32.const -1
  )

  (func (export "element_order") (param $ptr i32) (param $order i32) (param $identity i32) (param $a i32) (result i32)
    (local $current i32)
    (local $count i32)
    local.get $identity
    local.set $current
    i32.const 0
    local.set $count

    (block $exit
      (loop $pow
        local.get $count
        local.get $order
        i32.ge_u
        br_if $exit

        local.get $ptr
        local.get $order
        local.get $current
        local.get $a
        call $cell
        local.set $current

        local.get $count
        i32.const 1
        i32.add
        local.set $count

        local.get $current
        local.get $identity
        i32.eq
        if
          local.get $count
          return
        end

        br $pow
      )
    )
    i32.const -1
  )
)

