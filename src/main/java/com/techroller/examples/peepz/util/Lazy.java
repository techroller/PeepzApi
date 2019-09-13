package com.techroller.examples.peepz.util;

import java.util.function.Consumer;
import java.util.function.Supplier;

public class Lazy<T> implements Supplier<T> {
    private final Supplier<T> supplier;
    private T value;

    private Lazy(Supplier<T> supplier) {
        this.supplier = supplier;
    }

    public static <E> Lazy<E> of(Supplier<E> supplier) {
        return new Lazy<>(supplier);
    }

    public T get() {
        if (value == null) {
            value = supplier.get();
        }
        return value;
    }

    public void swap(Supplier<T> swapper) {
        value = swapper.get();
    }

    public void withInstance(Consumer<T> consumer) {
        consumer.accept(get());
    }
}
