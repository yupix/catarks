import { hiraganaToKatagana, katakanaToHiragana, replaceNumbersWithRoman } from "#app/utils/text-convertor.ts"
import { Check, ChevronsUpDown } from "lucide-react"


import React, { useEffect } from "react"
import { Button } from "./ui/button.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.tsx"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command.tsx"
import { ScrollArea } from "./ui/scroll-area.tsx"
import { cn } from "#app/utils/misc.tsx"
import { useRemixForm, useRemixFormContext } from "remix-hook-form"
import { FieldValues, Path, PathValue } from "react-hook-form"
import { FormField } from "./ui/form.tsx"

export type AutoCompleteItem = {
    label: string
    value: string
}

type AutoCompleteProps = {
    id?: string;
    options: AutoCompleteItem[]
    placeholder: string
    searchWordPlaceholder?: string
    notfoundText?: string
    label?: string
    onSelected?: (value: AutoCompleteItem) => void
    onCustomSelected?: (value: AutoCompleteItem) => void
}

type AutoCompleteWithFormFieldProps<T extends FieldValues> = {
    name: Path<T>
    form: ReturnType<typeof useRemixForm<T>>
} & AutoCompleteProps

export function calculateMatchScore(inputText: string, searchText: string) {
    // 文字列をカタカナからひらがなに変換
    const inputTextHiragana = katakanaToHiragana(inputText);
    const searchTextHiragana = katakanaToHiragana(searchText);

    // 文字列をローマ数字と通常の数字を区別せずに変換
    const inputTextNoNumbers = replaceNumbersWithRoman(inputTextHiragana);
    const searchTextNoNumbers = replaceNumbersWithRoman(searchTextHiragana);

    // 検索用の文字列が見つかった回数を数える
    const matches = inputTextNoNumbers.match(new RegExp(searchTextNoNumbers, 'gi'));
    const matchCount = matches ? matches.length : 0;

    // スコアを計算する（検索用の文字列の一致数を基に0から1の範囲に変換）
    const score = matchCount / Math.max(inputTextNoNumbers.length, 1);

    return score;
}

export function AutoCompleteWithFormField<T extends FieldValues>(props: AutoCompleteWithFormFieldProps<T>) {
    return (
        <FormField
            control={props.form.control}
            name={props.name as Path<T>}
            render={() => (<AutoComplete {...props} onSelected={(v) => props.form.setValue(props.name, v.value as PathValue<T, Path<T>>)} />)}

        />
    )
}

export function AutoComplete({ id, options, placeholder, notfoundText, searchWordPlaceholder, onCustomSelected, onSelected }: AutoCompleteProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [filteredOptions, setFilteredOptions] = React.useState<AutoCompleteItem[]>(options)
    const [searchWord, setSearchWord] = React.useState("")

    function createCommandFilter(options: AutoCompleteItem[]) {
        function commandFilter(value: string, search: string): number {
            return calculateMatchScore(value, search)
        }
        return commandFilter
    }

    useEffect(() => {
        const replacedSearchWord = hiraganaToKatagana(replaceNumbersWithRoman(searchWord.replace("・", "").toLowerCase()))
        //const hiraganaInputValue = hiraganaToKatagana(replacedSearchWord);
        const filteredOptions = options.filter(
            (option) =>
                replaceNumbersWithRoman(hiraganaToKatagana(option.label
                    .replace("・", "")
                    .toLowerCase()))
                    .includes(replacedSearchWord)
        );
        setFilteredOptions(filteredOptions);
    }, [searchWord])


    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" id={id}>
                <Command filter={createCommandFilter(options)} shouldFilter={false} >
                    <CommandInput onChangeCapture={(e) => setSearchWord(e.currentTarget.value)} placeholder={searchWordPlaceholder} />
                    <CommandEmpty>{notfoundText}</CommandEmpty>
                    <ScrollArea className="h-[200px] z-50">
                        <CommandGroup>
                            {filteredOptions.map((option) => (
                                <CommandItem
                                    key={option.label}
                                    onSelect={() => {
                                        setValue(option.value)
                                        if (onSelected) {
                                            onSelected(option)
                                        }
                                        if (onCustomSelected) {
                                            onCustomSelected(option)
                                        }
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </ScrollArea >
                </Command>
            </PopoverContent>
        </Popover>)
}