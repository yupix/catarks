import { useReducer, useState } from 'react';
import { AutoComplete } from '#app/components/auto-complete.tsx';
import { Label } from '#app/components/ui/label.tsx';
import { Switch } from '#app/components/ui/switch.tsx';

const weaponRarities = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const materialExpMap: { [key: string]: number }[] = [
  { 'シルヴァプリム+20': 2850 },
  { 'ゴルドプリム+20': 4550 },
  { 'ゴルドプリム+30': 8300 },
  { 'N-EXP+20': 7450 },
  { ゴルドプリムⅡ: 100900 },
];

const weaponRequireExpMap: {
  [key: number]: {
    requireMoney: number;
    requireExpMap: {
      [key: number]: {
        increasedExp: number;
        maxRequireExp: number;
        requireLimitBreakMoney: number;
      };
    };
  };
} = {
  1: {
    requireMoney: 1000,
    requireExpMap: {
      10: {
        increasedExp: 1000,
        maxRequireExp: 1000,
        requireLimitBreakMoney: 0,
      },
      20: {
        increasedExp: 2000,
        maxRequireExp: 3000,
        requireLimitBreakMoney: 10000,
      },
      30: {
        increasedExp: 3000,
        maxRequireExp: 6000,
        requireLimitBreakMoney: 20000,
      },
      40: {
        increasedExp: 4000,
        maxRequireExp: 10000,
        requireLimitBreakMoney: 30000,
      },
      50: {
        increasedExp: 12500,
        maxRequireExp: 22500,
        requireLimitBreakMoney: 125000,
      },
      60: {
        increasedExp: 12500,
        maxRequireExp: 35000,
        requireLimitBreakMoney: 125000,
      },
      70: {
        increasedExp: 9100000,
        maxRequireExp: 9135000,
        requireLimitBreakMoney: 145000,
      },
    },
  },
  2: {
    requireMoney: 2000,
    requireExpMap: {
      10: {
        increasedExp: 1500,
        maxRequireExp: 1500,
        requireLimitBreakMoney: 0,
      },
      20: {
        increasedExp: 3000,
        maxRequireExp: 4500,
        requireLimitBreakMoney: 0,
      },
      30: {
        increasedExp: 4500,
        maxRequireExp: 9000,
        requireLimitBreakMoney: 30000,
      },
      40: {
        increasedExp: 6000,
        maxRequireExp: 15000,
        requireLimitBreakMoney: 45000,
      },
      50: {
        increasedExp: 12500,
        maxRequireExp: 27500,
        requireLimitBreakMoney: 125000,
      },
      60: {
        increasedExp: 12500,
        maxRequireExp: 40000,
        requireLimitBreakMoney: 125000,
      },
      70: {
        increasedExp: 9200000,
        maxRequireExp: 9240000,
        requireLimitBreakMoney: 145000,
      },
    },
  },
  3: {
    requireMoney: 3000,
    requireExpMap: {
      10: {
        increasedExp: 2500,
        maxRequireExp: 2500,
        requireLimitBreakMoney: 0,
      },
      20: {
        increasedExp: 5000,
        maxRequireExp: 7500,
        requireLimitBreakMoney: 0,
      },
      30: {
        increasedExp: 7500,
        maxRequireExp: 15000,
        requireLimitBreakMoney: 0,
      },
      40: {
        increasedExp: 10000,
        maxRequireExp: 25000,
        requireLimitBreakMoney: 120000,
      },
      50: {
        increasedExp: 12500,
        maxRequireExp: 37500,
        requireLimitBreakMoney: 125000,
      },
      60: {
        increasedExp: 12500,
        maxRequireExp: 50000,
        requireLimitBreakMoney: 125000,
      },
      70: {
        increasedExp: 9300000,
        maxRequireExp: 9350000,
        requireLimitBreakMoney: 160000,
      },
    },
  },
  4: {
    requireMoney: 4000,
    requireExpMap: {
      10: {
        increasedExp: 3500,
        maxRequireExp: 3500,
        requireLimitBreakMoney: 0,
      },
      20: {
        increasedExp: 7000,
        maxRequireExp: 10500,
        requireLimitBreakMoney: 0,
      },
      30: {
        increasedExp: 10500,
        maxRequireExp: 21000,
        requireLimitBreakMoney: 0,
      },
      40: {
        increasedExp: 14000,
        maxRequireExp: 35000,
        requireLimitBreakMoney: 0,
      },
      50: {
        increasedExp: 17500,
        maxRequireExp: 52500,
        requireLimitBreakMoney: 140000,
      },
      60: {
        increasedExp: 17500,
        maxRequireExp: 70000,
        requireLimitBreakMoney: 140000,
      },
      70: {
        increasedExp: 9400000,
        maxRequireExp: 9470000,
        requireLimitBreakMoney: 160000,
      },
    },
  },
  5: {
    requireMoney: 4200,
    requireExpMap: {
      10: {
        increasedExp: 4000,
        maxRequireExp: 4000,
        requireLimitBreakMoney: 0,
      },
      20: {
        increasedExp: 8000,
        maxRequireExp: 12000,
        requireLimitBreakMoney: 0,
      },
      30: {
        increasedExp: 12000,
        maxRequireExp: 24000,
        requireLimitBreakMoney: 0,
      },
      40: {
        increasedExp: 16000,
        maxRequireExp: 40000,
        requireLimitBreakMoney: 0,
      },
      50: {
        increasedExp: 20000,
        maxRequireExp: 60000,
        requireLimitBreakMoney: 150000,
      },
      60: {
        increasedExp: 20000,
        maxRequireExp: 80000,
        requireLimitBreakMoney: 150000,
      },
      70: {
        increasedExp: 9500000,
        maxRequireExp: 9580000,
        requireLimitBreakMoney: 170000,
      },
    },
  },
  6: {
    requireMoney: 4500,
    requireExpMap: {
      10: {
        increasedExp: 4500,
        maxRequireExp: 4500,
        requireLimitBreakMoney: 0,
      },
      20: {
        increasedExp: 9000,
        maxRequireExp: 13500,
        requireLimitBreakMoney: 0,
      },
      30: {
        increasedExp: 13500,
        maxRequireExp: 27000,
        requireLimitBreakMoney: 0,
      },
      40: {
        increasedExp: 18000,
        maxRequireExp: 45000,
        requireLimitBreakMoney: 0,
      },
      50: {
        increasedExp: 22500,
        maxRequireExp: 67500,
        requireLimitBreakMoney: 160000,
      },
      60: {
        increasedExp: 22500,
        maxRequireExp: 90000,
        requireLimitBreakMoney: 160000,
      },
      70: {
        increasedExp: 9600000,
        maxRequireExp: 9690000,
        requireLimitBreakMoney: 180000,
      },
    },
  },
  7: {
    requireMoney: 4700,
    requireExpMap: {
      10: {
        increasedExp: 5000,
        maxRequireExp: 5000,
        requireLimitBreakMoney: 0,
      },
      20: {
        increasedExp: 10000,
        maxRequireExp: 15000,
        requireLimitBreakMoney: 0,
      },
      30: {
        increasedExp: 15000,
        maxRequireExp: 30000,
        requireLimitBreakMoney: 0,
      },
      40: {
        increasedExp: 20000,
        maxRequireExp: 50000,
        requireLimitBreakMoney: 0,
      },
      50: {
        increasedExp: 25000,
        maxRequireExp: 75000,
        requireLimitBreakMoney: 0,
      },
      60: {
        increasedExp: 25000,
        maxRequireExp: 100000,
        requireLimitBreakMoney: 170000,
      },
      70: {
        increasedExp: 9700000,
        maxRequireExp: 9800000,
        requireLimitBreakMoney: 190000,
      },
    },
  },
  8: {
    requireMoney: 5000,
    requireExpMap: {
      10: {
        increasedExp: 5500,
        maxRequireExp: 5500,
        requireLimitBreakMoney: 0,
      },
      20: {
        increasedExp: 11000,
        maxRequireExp: 16500,
        requireLimitBreakMoney: 0,
      },
      30: {
        increasedExp: 16500,
        maxRequireExp: 33000,
        requireLimitBreakMoney: 0,
      },
      40: {
        increasedExp: 22000,
        maxRequireExp: 55000,
        requireLimitBreakMoney: 0,
      },
      50: {
        increasedExp: 27500,
        maxRequireExp: 82500,
        requireLimitBreakMoney: 0,
      },
      60: {
        increasedExp: 27500,
        maxRequireExp: 110000,
        requireLimitBreakMoney: 180000,
      },
      70: {
        increasedExp: 9800000,
        maxRequireExp: 9910000,
        requireLimitBreakMoney: 200000,
      },
    },
  },
  9: {
    requireMoney: 5200,
    requireExpMap: {
      10: {
        increasedExp: 6000,
        maxRequireExp: 6000,
        requireLimitBreakMoney: 0,
      },
      20: {
        increasedExp: 12000,
        maxRequireExp: 18000,
        requireLimitBreakMoney: 0,
      },
      30: {
        increasedExp: 18000,
        maxRequireExp: 36000,
        requireLimitBreakMoney: 0,
      },
      40: {
        increasedExp: 24000,
        maxRequireExp: 60000,
        requireLimitBreakMoney: 0,
      },
      50: {
        increasedExp: 30000,
        maxRequireExp: 90000,
        requireLimitBreakMoney: 0,
      },
      60: {
        increasedExp: 36000,
        maxRequireExp: 126000,
        requireLimitBreakMoney: 190000,
      },
      70: {
        increasedExp: 9900000,
        maxRequireExp: 10026000,
        requireLimitBreakMoney: 200000,
      },
    },
  },
};

const allowedWeaponLevel = [0, 10, 20, 30, 40, 50, 60, 70] as const;

type STORE = {
  selectedRarity: number;
  currentLevel: number;
  targetLevel: number;
  selectedMaterial: number;
};

type ACTION_TYPE =
  | 'SET_SELECTED_RARITY'
  | 'SET_CURRENT_LEVEL'
  | 'SET_TARGET_LEVEL'
  | 'SET_SELECTED_MATERIAL'
  | 'SET_IS_GREAT_SUCCESS';

const reducer = (state: STORE, action: { type: ACTION_TYPE; payload: any }) => {
  switch (action.type) {
    case 'SET_SELECTED_RARITY':
      return {
        ...state,
        selectedRarity: action.payload,
      };
    case 'SET_CURRENT_LEVEL':
      return {
        ...state,
        currentLevel: action.payload,
      };
    case 'SET_TARGET_LEVEL':
      return {
        ...state,
        targetLevel: action.payload,
      };
    case 'SET_SELECTED_MATERIAL':
      return {
        ...state,
        selectedMaterial: action.payload,
      };
    default:
      return state;
  }
};

function Item({
  state,
  dispatch,
  isGreatSuccess,
}: {
  isGreatSuccess: boolean;
  state: STORE;
  dispatch: React.Dispatch<{
    type: ACTION_TYPE;
    payload: any;
  }>;
}) {
  const requireCurrentLevelExp =
    state.currentLevel === 0
      ? 0
      : weaponRequireExpMap[state.selectedRarity].requireExpMap[
          state.currentLevel
        ].maxRequireExp;
  const requireMaterialAmount = Math.floor(
    (weaponRequireExpMap[state.selectedRarity].requireExpMap[state.targetLevel]
      .maxRequireExp -
      requireCurrentLevelExp) /
      (isGreatSuccess ? state.selectedMaterial * 2 : state.selectedMaterial),
  );
  const requireEnhancementMoney =
    requireMaterialAmount *
    weaponRequireExpMap[state.selectedRarity].requireMoney;
  const requireLimitBreakMoney = Object.keys(
    weaponRequireExpMap[state.selectedRarity].requireExpMap,
  )
    .map((level) => {
      if (
        parseInt(level) > state.currentLevel &&
        parseInt(level) <= state.targetLevel
      ) {
        return weaponRequireExpMap[state.selectedRarity].requireExpMap[
          parseInt(level)
        ].requireLimitBreakMoney;
      }
      return 0;
    })
    .reduce((a, b) => a + b, 0);
  return (
    <div className='px-4 py-2'>
      <div className='grid sm:grid-cols-2 grid-cols-1 gap-2 mb-4'>
        <AutoComplete
          label={'アイテムのレアリティ'}
          placeholder='レアリティを選択'
          options={weaponRarities.map((rarity) => {
            return {
              label: rarity.toString(),
              value: rarity.toString(),
            };
          })}
          onSelected={(option) =>
            dispatch({
              type: 'SET_SELECTED_RARITY',
              payload: parseInt(option.value),
            })
          }
        />
        <AutoComplete
          options={materialExpMap.map((material) => {
            return {
              label: Object.keys(material)[0],
              value: Object.values(material)[0].toString(),
            };
          })}
          label={'使用する素材'}
          onSelected={(option) =>
            dispatch({
              type: 'SET_SELECTED_MATERIAL',
              payload: parseInt(option.value),
            })
          }
          placeholder='使用する素材を選択'
        />
      </div>
      <div className='grid sm:grid-cols-2 grid-cols-1 gap-2'>
        <AutoComplete
          label='現在のレベル'
          placeholder='現在のレベルを選択'
          options={allowedWeaponLevel
            .filter((level) => level < state.targetLevel)
            .map((level) => {
              return { label: level.toString(), value: level.toString() };
            })}
          onSelected={(option) =>
            dispatch({
              type: 'SET_CURRENT_LEVEL',
              payload: parseInt(option.value),
            })
          }
        />
        <AutoComplete
          label='目標のレベル'
          placeholder='目標のレベルを選択'
          options={allowedWeaponLevel
            .filter((level) => level > state.currentLevel)
            .map((level) => {
              return { label: level.toString(), value: level.toString() };
            })}
          onSelected={(option) =>
            dispatch({
              type: 'SET_TARGET_LEVEL',
              payload: parseInt(option.value),
            })
          }
        />
      </div>

      <div className='border-b my-2' />
      <ul>
        <li>
          必要な素材の個数:{' '}
          {Infinity === requireMaterialAmount
            ? 0
            : requireMaterialAmount.toLocaleString()}
        </li>
        <li>
          強化に掛かるメセタ{' '}
          {isNaN(requireEnhancementMoney)
            ? 0
            : requireEnhancementMoney.toLocaleString()}
        </li>
        <li>
          限界突破に掛かるメセタ {requireLimitBreakMoney.toLocaleString()}
        </li>
        <li>
          必要なメセタの総量{' '}
          {isNaN(requireEnhancementMoney)
            ? 0
            : (
                requireEnhancementMoney + requireLimitBreakMoney
              ).toLocaleString()}
        </li>
      </ul>
    </div>
  );
}

export default function WeaponEnhancementRoute() {
  const [item1, dispatchItem1] = useReducer(reducer, {
    selectedRarity: 1,
    currentLevel: 0,
    targetLevel: 10,
    selectedMaterial: 0,
  });
  const [item2, dispatchItem2] = useReducer(reducer, {
    selectedRarity: 1,
    currentLevel: 0,
    targetLevel: 10,
    selectedMaterial: 0,
  });
  const [isGreatSuccess, setIsGreatSuccess] = useState<boolean>(false);

  const requireCurrentLevelExp =
    item1.currentLevel === 0
      ? 0
      : weaponRequireExpMap[item1.selectedRarity].requireExpMap[
          item1.currentLevel
        ].maxRequireExp;
  const requireMaterialAmount = Math.floor(
    (weaponRequireExpMap[item1.selectedRarity].requireExpMap[item1.targetLevel]
      .maxRequireExp -
      requireCurrentLevelExp) /
      (isGreatSuccess ? item1.selectedMaterial * 2 : item1.selectedMaterial),
  );

  return (
    <>
      <div className='grid sm:grid-cols-7 grid-cols-1 gap-4 mb-4'>
        <div className='border rounded-md col-span-full md:col-span-1 '>
          <div className='py-2 w-full'>
            <div className='font-bold text-xl text-center'>OPTION</div>
            <div className='border-b my-2' />
          </div>
          <div className='px-4 py-2'>
            <div className='flex items-center space-x-2'>
              <Switch
                id='is-great-success'
                onCheckedChange={(checked) => setIsGreatSuccess(checked)}
              />
              <Label htmlFor='is-great-success'>強化大成功</Label>
            </div>
          </div>
        </div>
        <div className='border rounded-md md:col-span-3 col-span-full'>
          <div className='py-2'>
            <div className='font-bold text-xl text-center'>Item1</div>
            <div className='border-b my-2' />
            <Item
              isGreatSuccess={isGreatSuccess}
              state={item1}
              dispatch={dispatchItem1}
            />
          </div>
        </div>
        <div className='border rounded-md md:col-span-3 col-span-full'>
          <div className='py-2'>
            <div className='font-bold text-xl text-center'>Item2</div>
            <div className='border-b my-2' />
            <Item
              isGreatSuccess={isGreatSuccess}
              state={item2}
              dispatch={dispatchItem2}
            />
          </div>
        </div>
      </div>
      {/* <div className="border rounded-md md:col-span-5 col-span-full">
                    <div className="py-2">
                        <div className="font-bold text-xl text-center">RESULT</div>
                        <div className="border-b my-2" />
                    </div>
                    必要な素材の個数: {requireMaterialAmount}
                    必要なメセタ {requireMaterialAmount * item1.selectedMaterial}
                </div> */}
    </>
  );
}
